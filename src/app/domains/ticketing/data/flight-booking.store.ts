import { computed, inject } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes } from 'src/app/shared/util-common';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withComputed,
  withState,
} from '@ngrx/signals';

import { withCallState } from 'src/app/shared/util-common';
import { rxMethod } from '@ngrx/rxjs-interop';
import { debounceTime, filter, switchMap, tap } from 'rxjs';

export type Criteria = {
  from: string;
  to: string;
}

export const FlightBookingStore = signalStore(
  { providedIn: 'root' },
  withState({
    from: 'Paris',
    to: 'London',
    initialized: false,
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  }),
  withComputed(({ flights, basket, from, to }) => ({
    selected: computed(() => flights().filter((f) => basket()[f.id])),
    criteria: computed(() => ({ from: from(), to: to() })),
  })),
  withMethods((state) => {
    const { basket, flights, from, to, initialized } = state;
    const flightService = inject(FlightService);

    return {
      updateCriteria: (from: string, to: string) => {
        patchState(state, { from, to });
      },
      updateBasket: (flightId: number, selected: boolean) => {
        patchState(state, {
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

        patchState(state, { flights: updFlights });
      },
      load: async () => {
        if (!from() || !to()) return;
        const flights = await flightService.findPromise(from(), to());
        patchState(state, { flights });
      },
      connectCriteria: rxMethod<Criteria>((c$) => c$.pipe(
        filter(c => c.from.length >= 3 && c.to.length >= 3),
        debounceTime(300),
        switchMap((c) => flightService.find(c.from, c.to)),
        tap(flights => patchState(state, { flights }))
      ))
    };
  }),
  withHooks({
    onInit({ connectCriteria, criteria }) {

      connectCriteria(criteria);

    },
    onDestroy({ flights }) {
      console.log('flights are destroyed', flights());
    },
  }),
  withCallState()
);