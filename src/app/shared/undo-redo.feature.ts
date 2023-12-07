import { patchState, signalStoreFeature, type, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { Entity, Filter } from "./util-common";
import { EntityId } from "@ngrx/signals/entities";
import { effect, signal, untracked } from "@angular/core";

export type StackItem = {
    filter: Filter;
    entityMap: Record<EntityId, Entity>;
    ids: EntityId[];
    selectedIds: Record<EntityId, boolean>;
};

export type UndoRedoOptions = {
    maxStackSize: number;
}

export const defaultUndoRedoOptions: UndoRedoOptions = {
    maxStackSize: 100
}

export function withUndoRedo(options = defaultUndoRedoOptions) {

    let previous: StackItem | null = null;
    let skipOnce = false;

    //
    // Design Decision: This feature has its own
    // internal state.
    //
    // Please see an alternative implementation
    // that adds the feature's state to the 
    // Signal Store too in the branch
    // `arc-signal-custom-examples-undoredo-alternative``
    //
    
    const undoStack: StackItem[] = [];
    const redoStack: StackItem[] = [];

    const canUndo = signal(false);
    const canRedo = signal(false);

    const updateInternal = () => {
        canUndo.set(undoStack.length !== 0);
        canRedo.set(redoStack.length !== 0);
    };

    return signalStoreFeature(
        {
            state: type<{
                filter: Filter,
                entityMap: Record<EntityId, Entity>,
                ids: EntityId[],
                selectedIds: Record<EntityId, boolean>
            }>(),
        },
        withComputed(() => ({
            canUndo: canUndo.asReadonly(),
            canRedo: canRedo.asReadonly()
        })),
        withMethods((store) => ({
            undo(): void {
                const item = undoStack.pop();

                if (item && previous) {
                    redoStack.push(previous);
                }

                if (item) {
                    skipOnce = true;
                    patchState(store, item);
                    previous = item;
                }

                updateInternal();
            },
            redo(): void {
                const item = redoStack.pop();

                if (item && previous) {
                    undoStack.push(previous);
                }

                if (item) {
                    skipOnce = true;
                    patchState(store, item);
                    previous = item;
                }

                updateInternal();
            }
        })),
        withHooks({
            onInit(store) {
                effect(() => {
                    const filter = store.filter();
                    const entityMap = store.entityMap();
                    const ids = store.ids();
                    const selectedIds = store.selectedIds();

                    if (skipOnce) {
                        skipOnce = false;
                        return;
                    }

                    // Clear redoStack after recorded action
                    redoStack.splice(0);

                    if (previous) {
                        undoStack.push(previous);
                    }

                    if (redoStack.length > options.maxStackSize) {
                        undoStack.unshift();
                    }

                    previous = { filter, entityMap, ids, selectedIds };

                    // Don't propogate current reactive context
                    untracked(() => updateInternal());
                })
            }
        })

    )
}