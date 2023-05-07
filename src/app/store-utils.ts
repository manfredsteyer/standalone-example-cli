import { createStore } from "./solid-store";

export function createSolidStore<T extends object>(state: T) {
    return {
      _store: createStore(state),
      get state() {
        return this._store[0];
      },
      get set() {
        return this._store[1];
      }
    };
}
