import { patchState, signalStoreFeature, type, withHooks, withMethods, withState } from "@ngrx/signals";
import { Entity, Filter } from "./util-common";
import { EntityId } from "@ngrx/signals/entities";
import { effect } from "@angular/core";

export type StackItem = {
    filter: Filter;
    entityMap: Record<EntityId, Entity>,
    ids: EntityId[]
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
    const undoStack: StackItem[] = [];
    const redoStack: StackItem[] = [];

    return signalStoreFeature(
        {
            state: type<{
                filter: Filter,
                entityMap: Record<EntityId, Entity>,
                ids: EntityId[]
            }>(),
        },
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
            }
        })),
        withHooks({
            onInit(store) {
                effect(() => {
                    const filter = store.filter();
                    const entityMap = store.entityMap();
                    const ids = store.ids();

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

                    previous = { filter, entityMap, ids };
                })
            }
        })

    )
}