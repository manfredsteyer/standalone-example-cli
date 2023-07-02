import { WritableSignal } from '@angular/core';

export type SignalStateUpdateFn<State> = (
  ...updaters: Array<Partial<State> | ((state: State) => Partial<State>)>
) => void;

export type SignalStateUpdate<State> = {
  $update: SignalStateUpdateFn<State>;
};

export function signalStateUpdateFactory<State extends Record<string, unknown>>(
  stateSignal: WritableSignal<State>
): SignalStateUpdateFn<State> {
  return (...updaters) =>
    stateSignal.update((state) =>
      updaters.reduce(
        (currentState: State, updater) => ({
          ...currentState,
          ...(typeof updater === 'function' ? updater(currentState) : updater),
        }),
        state
      )
    );
}
