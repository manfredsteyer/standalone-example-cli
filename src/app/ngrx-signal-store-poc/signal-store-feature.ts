import { Signal } from '@angular/core';
import { SignalStateUpdateFn } from './signal-state-update';
import { DeepSignal } from './deep-signal';

export type SignalStoreFeature = {
  state?: Record<string, unknown>;
  signals?: Record<string, Signal<any>>;
  methods?: Record<string, (...args: any[]) => any>;
  hooks?: {
    onInit?: () => void;
    onDestroy?: () => void;
  };
};

export type EmptySignalStoreFeature = {
  state: {};
  signals: {};
  methods: {};
  hooks: {};
};

export type SignalStoreFeatureInput<
  Feature extends SignalStoreFeature,
  State = 'state' extends keyof Feature ? Feature['state'] : {},
  Signals = 'signals' extends keyof Feature ? Feature['signals'] : {},
  Methods = 'methods' extends keyof Feature ? Feature['methods'] : {}
> = {
  $update: SignalStateUpdateFn<State>;
  slices: SignalStoreSlices<State>;
  signals: Signals;
  methods: Methods;
};

export type SignalStoreFeatureFactory = (
  input: SignalStoreFeatureInput<{
    state: Record<string, unknown>;
    signals: Record<string, Signal<any>>;
    methods: Record<string, (...args: any[]) => any>;
  }>
) => SignalStoreFeature;

export type SignalStoreSlices<State> = {
  [Key in keyof State]: DeepSignal<State[Key]>;
};

export type F1Factory<F1 extends SignalStoreFeature> = (
  input: SignalStoreFeatureInput<EmptySignalStoreFeature>
) => F1;

export type F2Factory<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F2Input extends SignalStoreFeature = EmptySignalStoreFeature & F1
> = (input: SignalStoreFeatureInput<F2Input>) => F2;

export type F3Factory<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F3Input extends SignalStoreFeature = EmptySignalStoreFeature & F1 & F2
> = (input: SignalStoreFeatureInput<F3Input>) => F3;

export type F4Factory<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F4Input extends SignalStoreFeature = EmptySignalStoreFeature & F1 & F2 & F3
> = (input: SignalStoreFeatureInput<F4Input>) => F4;

export type F5Factory<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature,
  F5Input extends SignalStoreFeature = EmptySignalStoreFeature &
    F1 &
    F2 &
    F3 &
    F4
> = (input: SignalStoreFeatureInput<F5Input>) => F5;

export type F6Factory<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature,
  F6 extends SignalStoreFeature,
  F6Input extends SignalStoreFeature = EmptySignalStoreFeature &
    F1 &
    F2 &
    F3 &
    F4 &
    F5
> = (input: SignalStoreFeatureInput<F6Input>) => F6;

export function signalStoreFeatureFactory<
  F1 extends SignalStoreFeature = {},
  Input extends SignalStoreFeatureInput<F1> = SignalStoreFeatureInput<F1>
>() {
  function signalStoreFeature<F2 extends SignalStoreFeature>(
    f2: F2Factory<F1, F2>
  ): (featureInput: Input) => F2;
  function signalStoreFeature<
    F2 extends SignalStoreFeature,
    F3 extends SignalStoreFeature
  >(
    f2: F2Factory<F1, F2>,
    f3: F3Factory<F1, F2, F3>
  ): (featureInput: Input) => F2 & F3;
  function signalStoreFeature<
    F2 extends SignalStoreFeature,
    F3 extends SignalStoreFeature,
    F4 extends SignalStoreFeature
  >(
    f2: F2Factory<F1, F2>,
    f3: F3Factory<F1, F2, F3>,
    f4: F4Factory<F1, F2, F3, F4>
  ): (featureInput: Input) => F2 & F3 & F4;
  function signalStoreFeature<
    F2 extends SignalStoreFeature,
    F3 extends SignalStoreFeature,
    F4 extends SignalStoreFeature,
    F5 extends SignalStoreFeature
  >(
    f2: F2Factory<F1, F2>,
    f3: F3Factory<F1, F2, F3>,
    f4: F4Factory<F1, F2, F3, F4>,
    f5: F5Factory<F1, F2, F3, F4, F5>
  ): (featureInput: Input) => F2 & F3 & F4 & F5;
  function signalStoreFeature<
    F2 extends SignalStoreFeature,
    F3 extends SignalStoreFeature,
    F4 extends SignalStoreFeature,
    F5 extends SignalStoreFeature,
    F6 extends SignalStoreFeature
  >(
    f2: F2Factory<F1, F2>,
    f3: F3Factory<F1, F2, F3>,
    f4: F4Factory<F1, F2, F3, F4>,
    f5: F5Factory<F1, F2, F3, F4, F5>,
    f6: F6Factory<F1, F2, F3, F4, F5, F6>
  ): (featureInput: Input) => F2 & F3 & F4 & F5 & F6;
  function signalStoreFeature(
    ...featureFactories: SignalStoreFeatureFactory[]
  ) {
    return featureFactories as any;
  }

  return signalStoreFeature;
}
