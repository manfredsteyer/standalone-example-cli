import { signal } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';
import {
  SignalStateUpdate,
  signalStateUpdateFactory,
} from './signal-state-update';
import { defaultEqualityFn } from './equality-fn';

export type SignalState<State extends Record<string, unknown>> =
  DeepSignal<State> & SignalStateUpdate<State>;

export function signalState<State extends Record<string, unknown>>(
  initialState: State
): SignalState<State> {
  const stateSignal = signal(initialState, { equal: defaultEqualityFn });
  const deepSignal = toDeepSignal(stateSignal);
  (deepSignal as SignalState<State>).$update =
    signalStateUpdateFactory(stateSignal);

  return deepSignal as SignalState<State>;
}
