import { Injectable, inject } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes, createStore } from 'src/app/shared/util-common';

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {
  private flightService = inject(FlightService);

  private state = createStore({
    from: 'Hamburg',
    to: 'Graz',
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  });

  // Option 1: fetch root signals as readonly
  flights = this.state.select(s => s.flights());
  from = this.state.select(s => s.from());
  to = this.state.select(s => s.to())

  // Option 2: use computed for selectors
  basket = this.state.select(s => s.basket());
  selected = this.state.select(s => s.flights().filter(f => s.basket()[f.id]));

  updateCriteria(from: string, to: string): void {
    this.state.update('from', from);
    this.state.update('to', to);
  }

  updateBasket(id: number, selected: boolean): void {
    this.state.update('basket', (basket) => ({
      ...basket,
      [id]: selected,
    }));
  }

  async load() {
    if (!this.from() || !this.to()) return;
    const flights = await this.flightService.findPromise(
      this.from(),
      this.to()
    );

    this.state.update('flights', flights);
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];

    const date = addMinutes(flight.date, 15);
    const updFlight = { ...flight, date };
    const updFlights = [updFlight, ...this.flights().slice(1)];

    this.state.update('flights', updFlights);
  }
}