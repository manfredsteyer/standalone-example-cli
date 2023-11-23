// Source: https://github.com/markostanimirovic/ngrx-signal-store-playground/blob/main/src/app/shared/call-state.feature.ts

import { Signal, computed } from '@angular/core';
import {
  SignalStoreFeature,
  signalStoreFeature,
  withComputed,
  withState,

} from '@ngrx/signals';

export type CallState = 'init' | 'loading' | 'loaded' | { error: string };


export function withCallState()
  : SignalStoreFeature<
    {
      state: {},
      signals: {},
      methods: {}
    },
    {
      state: {
        callState: CallState
      },
      signals: {
        loading: Signal<boolean>,
        loaded: Signal<boolean>,
        error: Signal<{ error: string } | null>
      },
      methods: {}
    }>;
export function withCallState(): SignalStoreFeature {
  return signalStoreFeature(
    withState<{ callState: CallState }>({ callState: 'init' }),
    withComputed(({ callState }) => ({
      loading: computed(() => callState() === 'loading'),
      loaded: computed(() => callState() === 'loaded'),
      error: computed(() => {
        const state = callState();
        return typeof state === 'object' ? state.error : null
      }),
    }))
  );
}

export function setLoading(): { callState: CallState } {
  return { callState: 'loading' };
}

export function setLoaded(): { callState: CallState } {
  return { callState: 'loaded' };
}

export function setError(error: string): { callState: CallState } {
  return { callState: { error } };
}
