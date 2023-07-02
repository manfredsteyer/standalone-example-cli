import { Signal } from '@angular/core';
import {
  SignalStoreSlices,
  SignalStoreFeatureInput,
} from '../signal-store-feature';
import { SignalStateUpdate } from '../signal-state-update';

export function withMethods<
  State extends Record<string, unknown>,
  Signals extends Record<string, Signal<any>>,
  PreviousMethods extends Record<string, (...args: any[]) => any>,
  Methods extends Record<string, (...args: any[]) => any>
>(
  methodsFactory: (
    input: SignalStoreSlices<State> &
      Signals &
      PreviousMethods &
      SignalStateUpdate<State>
  ) => Methods
): (
  featureInput: SignalStoreFeatureInput<{
    state: State;
    signals: Signals;
    methods: PreviousMethods;
  }>
) => { methods: Methods } {
  return (featureInput) => ({
    methods: methodsFactory({
      $update: featureInput.$update,
      ...featureInput.slices,
      ...featureInput.signals,
      ...featureInput.methods,
    }),
  });
}
