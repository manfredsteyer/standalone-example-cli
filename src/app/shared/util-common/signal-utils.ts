import {
  CreateSignalOptions,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';

import { equal } from './immutable-equal';

export type WritableSignalState<T> = {
  [P in keyof T]: WritableSignal<T[P]>;
};

export type SignalState<T> = {
  [P in keyof T]: Signal<T[P]>;
};

const defaultOptions: CreateSignalOptions<unknown> = {
  equal,
};

export type Projector<T, U> = (root: T) => U;

export interface Store<T> {
  select<U>(projector: Projector<SignalState<T>, U>): Signal<U>;
  update<U extends keyof T>(
    branch: U,
    update: T[U] | Projector<T[U], T[U]>
  ): void;
}

export function createStore<T extends object>(
  state: T,
  options = defaultOptions
): Store<T> {
  const keys = Object.keys(state) as Array<keyof T>;

  const rootNodes = keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: signal(state[key], options),
    }),
    {}
  ) as WritableSignalState<T>;

  return {
    select<U>(
      p: Projector<WritableSignalState<T>, U>,
      options = defaultOptions
    ): Signal<U> {
      return computed(() => p(rootNodes), options);
    },
    update<U extends keyof T>(branch: U, update: T[U] | Projector<T[U], T[U]>) {
      const s = rootNodes[branch];
      if (typeof update === 'function') {
        s.update(update as Projector<T[U], T[U]>);
      } else {
        s.set(update);
      }
    },
  };
}
