import {
  DestroyRef,
  inject,
  Injectable,
  Signal,
  signal,
  Type,
} from '@angular/core';
import {
  F1Factory,
  F2Factory,
  F3Factory,
  F4Factory,
  F5Factory,
  F6Factory,
  SignalStoreFeature,
  SignalStoreFeatureFactory,
  SignalStoreFeatureInput,
} from './signal-store-feature';
import {
  SignalStateUpdate,
  signalStateUpdateFactory,
} from './signal-state-update';
import { toDeepSignal } from './deep-signal';
import { selectSignal } from './select-signal';
import { defaultEqualityFn } from './equality-fn';

type SignalStoreConfig = { providedIn: 'root' };

type F1Result<F1 extends SignalStoreFeature> = SignalStoreFeatureResult<F1> &
  SignalStateUpdate<F1['state']>;

type F2Result<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature
> = SignalStoreFeatureResult<F1> &
  SignalStoreFeatureResult<F2> &
  SignalStateUpdate<F1['state'] & F2['state']>;

type F3Result<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature
> = SignalStoreFeatureResult<F1> &
  SignalStoreFeatureResult<F2> &
  SignalStoreFeatureResult<F3> &
  SignalStateUpdate<F1['state'] & F2['state'] & F3['state']>;

type F4Result<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature
> = SignalStoreFeatureResult<F1> &
  SignalStoreFeatureResult<F2> &
  SignalStoreFeatureResult<F3> &
  SignalStoreFeatureResult<F4> &
  SignalStateUpdate<F1['state'] & F2['state'] & F3['state'] & F4['state']>;

type F5Result<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature
> = SignalStoreFeatureResult<F1> &
  SignalStoreFeatureResult<F2> &
  SignalStoreFeatureResult<F3> &
  SignalStoreFeatureResult<F4> &
  SignalStoreFeatureResult<F5> &
  SignalStateUpdate<
    F1['state'] & F2['state'] & F3['state'] & F4['state'] & F5['state']
  >;

type F6Result<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature,
  F6 extends SignalStoreFeature
> = SignalStoreFeatureResult<F1> &
  SignalStoreFeatureResult<F2> &
  SignalStoreFeatureResult<F3> &
  SignalStoreFeatureResult<F4> &
  SignalStoreFeatureResult<F5> &
  SignalStoreFeatureResult<F6> &
  SignalStateUpdate<
    F1['state'] &
      F2['state'] &
      F3['state'] &
      F4['state'] &
      F5['state'] &
      F6['state']
  >;

type SignalStoreFeatureResult<
  Feature extends SignalStoreFeature,
  Input extends SignalStoreFeatureInput<Feature> = SignalStoreFeatureInput<Feature>
> = Input['slices'] & Input['signals'] & Input['methods'];

export function signalStore<F1 extends SignalStoreFeature>(
  f1: F1Factory<F1>
): Type<F1Result<F1>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature
>(f1: F1Factory<F1>, f2: F2Factory<F1, F2>): Type<F2Result<F1, F2>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature
>(
  f1: F1Factory<F1>,
  f2: F2Factory<F1, F2>,
  f3: F3Factory<F1, F2, F3>
): Type<F3Result<F1, F2, F3>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature
>(
  f1: F1Factory<F1>,
  f2: F2Factory<F1, F2>,
  f3: F3Factory<F1, F2, F3>,
  f4: F4Factory<F1, F2, F3, F4>
): Type<F4Result<F1, F2, F3, F4>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature
>(
  f1: F1Factory<F1>,
  f2: F2Factory<F1, F2>,
  f3: F3Factory<F1, F2, F3>,
  f4: F4Factory<F1, F2, F3, F4>,
  f5: F5Factory<F1, F2, F3, F4, F5>
): Type<F5Result<F1, F2, F3, F4, F5>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature,
  F6 extends SignalStoreFeature
>(
  f1: F1Factory<F1>,
  f2: F2Factory<F1, F2>,
  f3: F3Factory<F1, F2, F3>,
  f4: F4Factory<F1, F2, F3, F4>,
  f5: F5Factory<F1, F2, F3, F4, F5>,
  f6: F6Factory<F1, F2, F3, F4, F5, F6>
): Type<F6Result<F1, F2, F3, F4, F5, F6>>;

export function signalStore<F1 extends SignalStoreFeature>(
  config: SignalStoreConfig,
  f1: F1Factory<F1>
): Type<F1Result<F1>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature
>(
  config: SignalStoreConfig,
  f1: F1Factory<F1>,
  f2: F2Factory<F1, F2>
): Type<F2Result<F1, F2>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature
>(
  config: SignalStoreConfig,
  f1: F1Factory<F1>,
  f2: F2Factory<F1, F2>,
  f3: F3Factory<F1, F2, F3>
): Type<F3Result<F1, F2, F3>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature
>(
  config: SignalStoreConfig,
  f1: F1Factory<F1>,
  f2: F2Factory<F1, F2>,
  f3: F3Factory<F1, F2, F3>,
  f4: F4Factory<F1, F2, F3, F4>
): Type<F4Result<F1, F2, F3, F4>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature
>(
  config: SignalStoreConfig,
  f1: F1Factory<F1>,
  f2: F2Factory<F1, F2>,
  f3: F3Factory<F1, F2, F3>,
  f4: F4Factory<F1, F2, F3, F4>,
  f5: F5Factory<F1, F2, F3, F4, F5>
): Type<F5Result<F1, F2, F3, F4, F5>>;
export function signalStore<
  F1 extends SignalStoreFeature,
  F2 extends SignalStoreFeature,
  F3 extends SignalStoreFeature,
  F4 extends SignalStoreFeature,
  F5 extends SignalStoreFeature,
  F6 extends SignalStoreFeature
>(
  config: SignalStoreConfig,
  f1: F1Factory<F1>,
  f2: F2Factory<F1, F2>,
  f3: F3Factory<F1, F2, F3>,
  f4: F4Factory<F1, F2, F3, F4>,
  f5: F5Factory<F1, F2, F3, F4, F5>,
  f6: F6Factory<F1, F2, F3, F4, F5, F6>
): Type<F6Result<F1, F2, F3, F4, F5, F6>>;

export function signalStore(
  ...args:
    | [SignalStoreConfig, ...SignalStoreFeatureFactory[]]
    | SignalStoreFeatureFactory[]
) {
  const [config, ...featureFactories] =
    'providedIn' in args[0]
      ? [args[0], ...(args.slice(1) as SignalStoreFeatureFactory[])]
      : [{}, ...(args as SignalStoreFeatureFactory[])];

  @Injectable({ providedIn: config.providedIn || null })
  class SignalStore {
    constructor() {
      const props = signalStoreFactory(featureFactories);
      for (const key in props) {
        (this as any)[key] = props[key];
      }
    }
  }

  return SignalStore;
}

function signalStoreFactory(
  featureFactories: SignalStoreFeatureFactory[]
): Record<string, unknown> {
  const stateSignal = signal<Record<string, unknown>>(
    {},
    { equal: defaultEqualityFn }
  );
  const $update = signalStateUpdateFactory(stateSignal);
  const featureInput: SignalStoreFeatureInput<{
    state: Record<string, unknown>;
    signals: Record<string, Signal<any>>;
    methods: Record<string, (...args: any[]) => any>;
  }> = {
    $update,
    slices: {},
    signals: {},
    methods: {},
  };
  const onInits: Array<() => void> = [];
  const onDestroys: Array<() => void> = [];

  for (const featureFactory of featureFactories.flat()) {
    const feature = featureFactory(featureInput);

    if (feature.state && Object.keys(feature.state).length > 0) {
      stateSignal.update((state) => ({ ...state, ...feature.state }));
    }

    for (const key in feature.state) {
      featureInput.slices[key] = toDeepSignal(
        selectSignal(() => stateSignal()[key])
      );
    }

    for (const key in feature.signals) {
      featureInput.signals[key] = feature.signals[key];
    }

    for (const key in feature.methods) {
      featureInput.methods[key] = feature.methods[key];
    }

    if (feature.hooks) {
      feature.hooks.onInit && onInits.push(feature.hooks.onInit);
      feature.hooks.onDestroy && onDestroys.push(feature.hooks.onDestroy);
    }
  }

  onInits.forEach((onInit) => onInit());

  if (onDestroys.length > 0) {
    inject(DestroyRef).onDestroy(() =>
      onDestroys.forEach((onDestroy) => onDestroy())
    );
  }

  return {
    $update,
    ...featureInput.slices,
    ...featureInput.signals,
    ...featureInput.methods,
  };
}
