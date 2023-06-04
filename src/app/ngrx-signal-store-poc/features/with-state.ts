import { signal, Signal } from '@angular/core';
import { SignalState } from '../models';

export function withState<StaticState extends Record<string, unknown>>(
  state: StaticState
): () => {
  state: SignalState<StaticState>;
  computed: {};
  updaters: {};
  effects: {};
  hooks: { onInit: () => void; onDestroy: () => void };
} {
  return () => ({
    state: Object.keys(state).reduce(
      (acc, key) => ({
        ...acc,
        [key]: signal(state[key]),
      }),
      {} as SignalState<StaticState>
    ),
    computed: {},
    updaters: {},
    effects: {},
    hooks: {
      onInit() {},
      onDestroy() {},
    },
  });
}
