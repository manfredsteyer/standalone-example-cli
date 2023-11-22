import { computed, effect, inject } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes, setLoaded, setLoading } from 'src/app/shared/util-common';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withComputed,
  withState,
} from '@ngrx/signals';

import { withCallState } from 'src/app/shared/util-common';

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

  withCallState({ prop: 'passengers'}),
  withCallState({ prop: 'flights' }),

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

        patchState(state, setLoading('flights'))

        const flights = await flightService.findPromise(from(), to());

        patchState(state, setLoaded('flights'))
        patchState(state, { flights });

      }
    };
  }),

  withHooks({
    onInit({ load, flightsLoading, flightsLoaded }) {
      load();
      effect(() => {
        console.log('flightsLoading', flightsLoading())
        console.log('flightsLoaded', flightsLoaded())

      })
    },
    onDestroy({ flights }) {
      console.log('flights are destroyed', flights());
    },
  }),
);