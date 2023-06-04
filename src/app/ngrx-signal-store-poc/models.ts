import { Signal } from '@angular/core';

export type SignalStoreUpdateFn<State> = (
  ...updaters: Array<Partial<State> | ((state: State) => Partial<State>)>
) => void;

export interface SignalStoreUpdate<State> {
  update: SignalStoreUpdateFn<State>;
}

export type SignalStoreFeature = {
  state: Record<string, Signal<any>>;
  computed: Record<string, Signal<any>>;
  updaters: Record<string, (...args: any[]) => void>;
  effects: Record<string, (...args: any[]) => any>;
  hooks: {
    onInit: () => void;
    onDestroy: () => void;
  };
};

export type SignalStoreFeatureFactory = (
  feature: SignalStoreFeature & SignalStoreUpdate<any>
) => SignalStoreFeature;

export type SignalState<StaticState extends Record<string, unknown>> = {
  [Key in keyof StaticState]: Signal<StaticState[Key]>;
};

export type StaticState<SignalState extends Record<string, Signal<any>>> = {
  [Key in keyof SignalState]: SignalState[Key] extends Signal<infer Value>
    ? Value
    : never;
};
