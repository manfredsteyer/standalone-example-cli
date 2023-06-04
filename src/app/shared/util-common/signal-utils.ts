import { CreateSignalOptions, WritableSignal, signal } from '@angular/core';
import { equal } from './immutable-equal';

export function patchSignal<T>(
  signal: WritableSignal<T>,
  partialState: Partial<T>
) {
  signal.update((state) => ({
    ...state,
    ...partialState,
  }));
}

export type SignalState<T> = {
  [P in keyof T]: WritableSignal<T[P]>;
};

const defaultOptions: CreateSignalOptions<unknown> = {
  equal,
};

export function createState<T extends object>(
  state: T,
  options = defaultOptions
): SignalState<T> {
  const keys = Object.keys(state) as Array<keyof T>;

  const result = keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: signal(state[key], options),
    }),
    {}
  );

  return result as SignalState<T>;
}
