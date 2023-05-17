import { ComponentStore } from "@ngrx/component-store";

export function createComponentStore<T extends object>(init: T) {
    return new ComponentStore(init);
}