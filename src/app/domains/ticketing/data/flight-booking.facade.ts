import { Injectable, computed, inject } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes } from 'src/app/shared/util-common';
import {
  signalStore,
  withState,
  withComputed,
  withUpdaters,
  withEffects,
} from '../../../ngrx-signal-store-poc';

const FlightBookingStore = signalStore(
  { providedIn: 'root' },
  withState({
    from: 'Paris',
    to: 'London',
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  }),
  withComputed(({ flights, basket }) => ({
    selected: computed(() => flights().filter((f) => basket()[f.id])),
  })),
  withUpdaters(({ update, basket, flights }) => ({
    updateCriteria: (from: string, to: string) => {
      update({ from, to });
    },
    updateBasket: (flightId: number, selected: boolean) => {
      update({
        basket: {
          ...basket,
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

      update({ flights: updFlights });
    },
  })),
  withEffects(({ update, from, to }) => {
    const flightService = inject(FlightService);

    return {
      async load() {
        if (!from() || !to()) return;
        const flights = await flightService.findPromise(from(), to());

        update({ flights });
      },
    };
  })
);

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {
  // private flightService = inject(FlightService);
  private store = inject(FlightBookingStore);

  // fetch root signals as readonly
  flights = this.store.flights;
  from = this.store.from;
  to = this.store.to;
  basket = this.store.basket;

  // fetch selected signal
  selected = this.store.selected;

  updateCriteria(from: string, to: string): void {
    this.store.updateCriteria(from, to);
  }

  updateBasket(id: number, selected: boolean): void {
    this.store.updateBasket(id, selected);
  }

  async load() {
    this.store.load();
  }

  delay(): void {
    this.store.delay()
  }
}
