import { Signal, computed } from '@angular/core';
import {
  SignalStoreFeature,
  signalStoreFeature,
  withComputed,
  withState,
} from '@ngrx/signals';

export type CallState = 'init' | 'loading' | 'loaded' | { error: string };

export type NamedCallStateSlice<Prop extends string> = {
  [K in Prop as `${K}CallState`]: CallState;
};

export type CallStateSlice = {
  callState: CallState
}

export type NamedCallStateSignals<Prop extends string> = {
  [K in Prop as `${K}Loading`]: Signal<boolean>;
} & {
    [K in Prop as `${K}Loaded`]: Signal<boolean>;
  } & {
    [K in Prop as `${K}Error`]: Signal<string | null>;
  };

export type CallStateSignals = {
  loading: Signal<boolean>;
  loaded: Signal<boolean>;
  error: Signal<string | null>
} 

export function getCallStateKeys(config?: { prop?: string }) {
  
  const prop = config?.prop;

  return {
    callStateKey: prop ?  `${config.prop}CallState` : 'callState',
    loadingKey: prop ? `${config.prop}Loading` : 'loading',
    loadedKey: prop ? `${config.prop}Loaded` : 'loaded',
    errorKey: prop ? `${config.prop}Error` : 'error',
  };
}

export function withCallState<Prop extends string>(config: {
  prop: Prop;
}): SignalStoreFeature<
  { state: {}, signals: {}, methods: {} },
  {
    state: NamedCallStateSlice<Prop>,
    signals: NamedCallStateSignals<Prop>,
    methods: {}
  }
>;

export function withCallState(): SignalStoreFeature<
  { state: {}, signals: {}, methods: {} },
  {
    state: CallStateSlice,
    signals: CallStateSignals,
    methods: {}
  }
>;

export function withCallState<Prop extends string>(config?: {
  prop: Prop;
}): SignalStoreFeature {
  const { callStateKey, errorKey, loadedKey, loadingKey } =
    getCallStateKeys(config);

  return signalStoreFeature(
    withState({ [callStateKey]: 'init' }),
    withComputed((state: Record<string, Signal<unknown>>) => {

      const callState = state[callStateKey] as Signal<CallState>;

      return {
        [loadingKey]: computed(() => callState() === 'loading'),
        [loadedKey]: computed(() => callState() === 'loaded'),
        [errorKey]: computed(() => {
          const v = callState();
          return typeof v === 'object' ? v.error : null;
        })
      }
    })
  );
}

export function setLoading<Prop extends string>(
  prop: Prop
): NamedCallStateSlice<Prop> {
  return { [`${prop}CallState`]: 'loading' } as NamedCallStateSlice<Prop>;
}

export function setLoaded<Prop extends string>(
  prop: Prop
): NamedCallStateSlice<Prop> {
  return { [`${prop}CallState`]: 'loaded' } as NamedCallStateSlice<Prop>;
}

export function setError<Prop extends string>(
  prop: Prop,
  error: string
): NamedCallStateSlice<Prop> {
  return { [`${prop}CallState`]: { error } } as NamedCallStateSlice<Prop>;
}
