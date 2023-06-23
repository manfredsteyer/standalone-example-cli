import { Injectable, inject } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes } from 'src/app/shared/util-common';
import {
  signalState,
  selectSignal,
} from '../../../ngrx-signal-store-poc';

// const Store = signalStore(
//   { providedIn: 'root' },
//   withState({
//     from: 'Paris',
//     to: 'London',
//     flights: [] as Flight[],
//     basket: {} as Record<number, boolean>,
//   }),
//   withComputed(({ flights, basket }) => ({
//     selected: computed(() => flights().filter((f) => basket()[f.id])),
//   }))
// );

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {
  private flightService = inject(FlightService);
  private state = signalState({
    from: 'Paris',
    to: 'London',
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  });

  // fetch root signals as readonly
  flights = this.state.flights;
  from = this.state.from;
  to = this.state.to;
  basket = this.state.basket;

  // fetch selected signal
  selected = selectSignal(
    this.flights, 
    this.basket, 
    (flights, basket) => flights.filter((f) => basket[f.id])
  )

  updateCriteria(from: string, to: string): void {
    this.state.$update({ from, to });
  }

  updateBasket(id: number, selected: boolean): void {
    this.state.$update((state) => ({
      ...state,
      basket: {
        ...state.basket,
        [id]: selected,
      },
    }));
  }

  async load() {
    if (!this.from() || !this.to()) return;
    const flights = await this.flightService.findPromise(
      this.from(),
      this.to()
    );

    this.state.$update({ flights });
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];

    const date = addMinutes(flight.date, 15);
    const updFlight = { ...flight, date };
    const updFlights = [updFlight, ...this.state.flights().slice(1)];

    this.state.$update({ flights: updFlights });
  }
}
