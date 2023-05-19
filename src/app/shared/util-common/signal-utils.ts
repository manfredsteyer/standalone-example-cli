import { WritableSignal } from '@angular/core';

export function patchSignal<T>(signal: WritableSignal<T>, partialState: Partial<T>) {
  signal.update((state) => ({
    ...state,
    ...partialState,
  }));
}
