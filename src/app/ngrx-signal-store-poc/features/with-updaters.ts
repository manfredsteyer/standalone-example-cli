import { Signal } from '@angular/core';
import { SignalStoreUpdate, StaticState } from '../models';

export function withUpdaters<
  State extends Record<string, Signal<any>>,
  Computed extends Record<string, Signal<any>>,
  PreviousUpdaters extends Record<string, (...args: any[]) => void>,
  Updaters extends Record<string, (...args: any[]) => void>
>(
  updatersFactory: (
    input: State &
      Computed &
      PreviousUpdaters &
      SignalStoreUpdate<StaticState<State>>
  ) => Updaters
): (
  feature: {
    state: State;
    computed: Computed;
    updaters: PreviousUpdaters;
  } & SignalStoreUpdate<StaticState<State>>
) => {
  state: {};
  computed: {};
  updaters: Updaters;
  effects: {};
  hooks: { onInit: () => void; onDestroy: () => void };
} {
  return (feature) => ({
    state: {},
    computed: {},
    updaters: updatersFactory({
      update: feature.update,
      ...feature.state,
      ...feature.computed,
      ...feature.updaters,
    } as State & Computed & PreviousUpdaters & SignalStoreUpdate<StaticState<State>>),
    effects: {},
    hooks: {
      onInit() {},
      onDestroy() {},
    },
  });
}
