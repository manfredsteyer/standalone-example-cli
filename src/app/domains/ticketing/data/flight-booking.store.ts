import { WritableSignal, inject, signal } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes, setLoaded, setLoading } from 'src/app/shared/util-common';
import {
  rxEffect,
  selectSignal,
  signalStore,
  withHooks,
  withMethods,
  withSignals,
  withState,
} from '@ngrx/signals';

import { withCallState } from 'src/app/shared/util-common';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';

type DeepFlight = {
  id: WritableSignal<number>;
  from: WritableSignal<string>;
  to: WritableSignal<string>;

}

function withDeep(state: {state: Flight}): () => {state: {flight: DeepFlight}} {
  return () => ({
    state: { flight: {id: signal(state.state.id),
    from: signal(state.state.from),
    to: signal(state.state.to)}}
  });
}

const flight: Flight = {
  id: 1000,
  from: 'A',
  to: 'B',
  date: 'now',
  delayed: true
};

export const FlightBookingStore = signalStore(
  { providedIn: 'root' },
  // withState({
  //   from: 'Paris',
  //   to: 'London',
  //   initialized: false,
  //   flights: [] as Flight[],
  //   basket: {} as Record<number, boolean>,
  // }),
  withDeep({
    state: flight
  }),
  // withCallState(),
  withSignals(({ flight }) => ({
    route: selectSignal(() => flight().from() + ' to ' + flight().to())
  })),
  
 
);
