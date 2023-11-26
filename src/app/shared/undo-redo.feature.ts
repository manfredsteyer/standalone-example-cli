import { PartialStateUpdater, patchState, signalStoreFeature, type, withHooks, withMethods, withState } from "@ngrx/signals";
import { Entity, Filter } from "./util-common";
import { EntityId } from "@ngrx/signals/entities";
import { effect } from "@angular/core";

export type UndoRedoOptions = {
    maxStackSize: number;
}

export const defaultUndoRedoOptions: UndoRedoOptions = {
    maxStackSize: 100
}

export type StackItem = {
    filter: Filter;
    entityMap: Record<EntityId, Entity>,
    ids: EntityId[]
};

export type UndoRedoState = {
    undoStack: StackItem[],
    redoStack: StackItem[]
}

function removeUndo(): PartialStateUpdater<UndoRedoState> {
    return (state: UndoRedoState) => {
        return { undoStack: [...state.undoStack.slice(0, -1)] }
    } 
}

function removeRedo(): PartialStateUpdater<UndoRedoState> {
    return (state: UndoRedoState) => {
        return { redoStack: [...state.redoStack.slice(0, -1)] }
    } 
}

function limit(stack: StackItem[], maxLength: number): StackItem[] {
    if (stack.length <= maxLength) {
        return stack;
    }

    return stack.slice(stack.length - maxLength)
}

function pushUndo(item: StackItem, maxLength: number): PartialStateUpdater<UndoRedoState> {
    return (state: UndoRedoState) => {
        return { undoStack: [...limit(state.undoStack, maxLength), item] }
    } 
}

function pushRedo(item: StackItem, maxLength: number): PartialStateUpdater<UndoRedoState> {
    return (state: UndoRedoState) => {
        return { redoStack: [...limit(state.redoStack, maxLength), item] }
    } 
}

function clearRedo(): Partial<UndoRedoState> {
    return {
        redoStack: []
    };
}

function peek(stack: StackItem[]) {
    return stack.at(-1);
}

export function withUndoRedo(options = defaultUndoRedoOptions) {

    let previous: StackItem | null = null;
    let skipOnce = false;

    return signalStoreFeature(
        {
            state: type<{
                filter: Filter,
                entityMap: Record<EntityId, Entity>,
                ids: EntityId[]
            }>(),
        },
        withState<UndoRedoState>({
            undoStack: [],
            redoStack: []
        }),
        withMethods((store) => ({
            undo(): void {

                const item = peek(store.undoStack());
                patchState(store, removeUndo());

                if (item && previous) {
                    patchState(store, pushRedo(previous, options.maxStackSize));
                }

                if (item) {
                    skipOnce = true;
                    patchState(store, item);
                    previous = item;
                }
            },
            redo(): void {
                const item = peek(store.redoStack());
                patchState(store, removeRedo());

                if (item && previous) {
                    patchState(store, pushUndo(previous, options.maxStackSize));
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
                    patchState(store, clearRedo());

                    if (previous) {
                        patchState(store, pushUndo(previous, options.maxStackSize))
                    }

                    previous = { filter, entityMap, ids };
                }, { allowSignalWrites: true })
            }
        })

    )
}