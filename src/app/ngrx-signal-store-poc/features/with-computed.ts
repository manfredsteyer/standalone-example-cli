import { Signal } from '@angular/core';

export function withComputed<
  State extends Record<string, Signal<any>>,
  PreviousComputed extends Record<string, Signal<any>>,
  Computed extends Record<string, Signal<any>>
>(
  computedFactory: (input: State & PreviousComputed) => Computed
): (feature: { state: State; computed: PreviousComputed }) => {
  state: {};
  computed: Computed;
  updaters: {};
  effects: {};
  hooks: { onInit: () => void; onDestroy: () => void };
} {
  return (feature) => ({
    state: {},
    computed: computedFactory({
      ...feature.state,
      ...feature.computed,
    } as State & PreviousComputed),
    updaters: {},
    effects: {},
    hooks: {
      onInit() {},
      onDestroy() {},
    },
  });
}
