import { Injectable, computed, inject } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes, createState, equal } from 'src/app/shared/util-common';

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {
  private flightService = inject(FlightService);

  private state = createState({
    from: 'Hamburg',
    to: 'Graz',
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  });

  // Option 1: fetch root signals as readonly
  flights = this.state.flights.asReadonly();
  from = this.state.from.asReadonly();
  to = this.state.to.asReadonly();

  // Option 2: use computed for selectors
  basket = computed(() => this.state.basket(), { equal });
  selected = computed(() => this.flights().filter(f => this.basket()[f.id]), { equal })

  updateCriteria(from: string, to: string): void {
    this.state.from.set(from);
    this.state.to.set(to);
  }

  updateBasket(id: number, selected: boolean): void {
    this.state.basket.update((basket) => ({
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

    this.state.flights.set(flights);
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];

    const date = addMinutes(flight.date, 15);
    const updFlight = { ...flight, date };
    const updFlights = [updFlight, ...this.state.flights().slice(1)];

    this.state.flights.set(updFlights);
  }
}
