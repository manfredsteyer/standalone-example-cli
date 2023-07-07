// Source: https://github.com/markostanimirovic/ngrx-signal-store-playground/blob/main/src/app/shared/call-state.feature.ts

import {
  selectSignal,
  signalStoreFeatureFactory,
  withSignals,
  withState,
} from '@ngrx/signals';

export function withLoadingState() {
  const loadingStateFeature = signalStoreFeatureFactory();

  return loadingStateFeature(
    withState({ loading: false }),
    withSignals(({ loading }) => ({
      ready: selectSignal(() => !loading()),
    }))
  );
}

export function setLoading(): { loading: boolean } {
  return { loading: true };
}

export function setReady(): { loading: boolean } {
  return { loading: false };
}
