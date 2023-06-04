import { Signal } from '@angular/core';
import { SignalStoreUpdate, StaticState } from '../models';

export function withEffects<
  State extends Record<string, Signal<any>>,
  Computed extends Record<string, Signal<any>>,
  Updaters extends Record<string, (...args: any[]) => void>,
  PreviousEffects extends Record<string, (...args: any[]) => any>,
  Effects extends Record<string, (...args: any[]) => any>
>(
  effectsFactory: (
    input: State &
      Computed &
      Updaters &
      PreviousEffects &
      SignalStoreUpdate<StaticState<State>>
  ) => Effects
): (
  feature: {
    state: State;
    computed: Computed;
    updaters: Updaters;
    effects: PreviousEffects;
  } & SignalStoreUpdate<StaticState<State>>
) => {
  state: {};
  computed: {};
  updaters: {};
  effects: Effects;
  hooks: { onInit: () => void; onDestroy: () => void };
} {
  return (feature) => ({
    state: {},
    computed: {},
    updaters: {},
    effects: effectsFactory({
      update: feature.update,
      ...feature.state,
      ...feature.computed,
      ...feature.updaters,
      ...feature.effects,
    } as State & Computed & Updaters & PreviousEffects & SignalStoreUpdate<StaticState<State>>),
    hooks: {
      onInit() {},
      onDestroy() {},
    },
  });
}
