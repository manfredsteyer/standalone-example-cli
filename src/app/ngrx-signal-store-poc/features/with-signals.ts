import { Signal } from '@angular/core';
import {
  SignalStoreSlices,
  SignalStoreFeatureInput,
} from '../signal-store-feature';

export function withSignals<
  State extends Record<string, unknown>,
  PreviousSignals extends Record<string, Signal<any>>,
  Signals extends Record<string, Signal<any>>
>(
  signalsFactory: (input: SignalStoreSlices<State> & PreviousSignals) => Signals
): (
  featureInput: SignalStoreFeatureInput<{
    state: State;
    signals: PreviousSignals;
  }>
) => { signals: Signals } {
  return (featureInput) => ({
    signals: signalsFactory({
      ...featureInput.slices,
      ...featureInput.signals,
    }),
  });
}
