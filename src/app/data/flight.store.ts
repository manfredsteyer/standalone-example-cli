import {
  patchState,
  selectSignal,
  signalStore,
  withMethods,
  withSignals,
  withState,
} from '@nrwl/signals';
import { Flight } from './flight';
import { FlightService } from './flight.service';
import { inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

export const FlightStore = signalStore(
  { providedIn: 'root' },
  withState({
    from: 'Graz',
    to: 'Hamburg',
    urgent: false,
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  }),
  withSignals(({ flights, basket }) => ({
    selected: selectSignal(flights, basket, (flights, basket) =>
      flights.filter((f) => basket[f.id])
    ),
  })),
  withMethods((state) => {
    const flightService = inject(FlightService);

    return {
      async load(): Promise<void> {
        const flights = await lastValueFrom(
          flightService.find(state.from(), state.to(), state.urgent())
        );
        patchState(state, { flights });
      },

      updateCriteria(criteria: { from?: string; to?: string }): void {
        patchState(state, { from: criteria.from, to: criteria.to });
      },

      updateBasket(flightId: number, selected: boolean): void {
        patchState(state, (state) => ({
          basket: {
            ...state.basket,
            [flightId]: selected,
          },
        }));
      },
    };
  })
);
