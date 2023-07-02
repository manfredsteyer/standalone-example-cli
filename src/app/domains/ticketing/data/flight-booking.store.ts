import { inject } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes } from 'src/app/shared/util-common';
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

export const FlightBookingStore = signalStore(
  { providedIn: 'root' },
  withState({
    from: 'Paris',
    to: 'London',
    initialized: false,
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  }),
  withSignals(({ flights, basket, from, to }) => ({
    selected: selectSignal(() => flights().filter((f) => basket()[f.id])),
    criteria: selectSignal(() => ({ from: from(), to: to() })),
  })),
  withMethods(({ $update, basket, flights, from, to, initialized }) => {
    const flightService = inject(FlightService);

    return {
      updateCriteria: (from: string, to: string) => {
        $update({ from, to });
      },
      updateBasket: (flightId: number, selected: boolean) => {
        $update({
          basket: {
            ...basket(),
            [flightId]: selected,
          },
        });
      },
      delay: () => {
        const currentFlights = flights();
        const flight = currentFlights[0];

        const date = addMinutes(flight.date, 15);
        const updFlight = { ...flight, date };
        const updFlights = [updFlight, ...currentFlights.slice(1)];

        $update({ flights: updFlights });
      },
      load: async () => {
        if (!from() || !to()) return;
        const flights = await flightService.findPromise(from(), to());
        $update({ flights });
      },
      loadBy: rxEffect<{ from: string; to: string }>(
        pipe(
          debounceTime(initialized() ? 300 : 0),
          switchMap((c) => flightService.find(c.from, c.to)),
          tap((flights) => $update({ flights, initialized: true }))
        )
      ),
    };
  }),
  withHooks({
    onInit({ load }) {
      load()
    },
    onDestroy({ flights }) {
      console.log('flights are destroyed', flights());
    },
  }),
  withCallState()
);
