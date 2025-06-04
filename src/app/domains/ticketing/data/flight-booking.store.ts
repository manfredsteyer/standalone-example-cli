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
  type
} from '@ngrx/signals';

import { setAllEntities, withEntities } from '@ngrx/signals/entities';

import { withCallState } from 'src/app/shared/util-common';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
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
    basket: {} as Record<number, boolean>,
  }),

  withEntities({ entity: type<Flight>(), collection: 'flight' }),

  withComputed(({ flightEntities, basket, from, to }) => ({
    selected: computed(() => flightEntities().filter((f) => basket()[f.id])),
    criteria: computed(() => ({ from: from(), to: to() })),
  })),

  withCallState(),

  withMethods((state) => {
    const { basket, flightEntities, from, to, initialized } = state;
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
        const currentFlights = flightEntities();
        const flight = currentFlights[0];

        const date = addMinutes(flight.date, 15);
        const updFlight = { ...flight, date };
        const updFlights = [updFlight, ...currentFlights.slice(1)];

        patchState(state, setAllEntities(updFlights, { collection: 'flight' }));
      },
      load: async () => {
        if (!from() || !to()) return;

        patchState(state, setLoading());

        const flights = await flightService.findPromise(from(), to());
        
        patchState(state, setAllEntities(flights, { collection: 'flight', selectId: (f) => f.id }));

        patchState(state, setLoaded());
      },
      connectCriteria: rxMethod<Criteria>((c$) => c$.pipe(
        filter(c => c.from.length >= 3 && c.to.length >= 3),
        debounceTime(300),
        switchMap((c) => flightService.find(c.from, c.to)),
        tap(flights => patchState(state, setAllEntities(flights, { collection: 'flight' })))
      ))
    };
  }),
  withHooks({
    onInit(store) {

      store.connectCriteria(store.criteria);

      effect(() => {
        console.log('flightEntityMap', store.flightEntityMap())
        console.log('flightIds', store.flightIds())
        console.log('flightEntities', store.flightEntities())
      });

    },
    onDestroy({ flightEntities }) {
      console.log('flights are destroyed', flightEntities());
    },
  }),
);