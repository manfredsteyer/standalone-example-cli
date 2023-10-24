import { Injectable, computed, inject, signal } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes } from 'src/app/shared/util-common';

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {
  private flightService = inject(FlightService);

  private state = signal({
    from: 'Hamburg',
    to: 'Graz',
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  });

  readonly flights = computed(() => this.state().flights);
  readonly from = computed(() => this.state().from);
  readonly to = computed(() => this.state().to);
  readonly basket = computed(() => this.state().basket);

  updateCriteria(from: string, to: string): void {
    this.state.update(state => ({
      ...state,
      from,
      to
    }));
  }

  updateBasket(id: number, selected: boolean): void {
    this.state.update(state => ({
      ...state,
      basket: {
        ...state.basket,
        [id]: selected,
      }
    }));
  }

  async load() {
    if (!this.from() || !this.to()) return;
    const flights = await this.flightService.findPromise(
      this.from(),
      this.to()
    );

    this.state.update(state => ({
      ...state,
      flights
    }));
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];

    const date = addMinutes(flight.date, 15);
    const updFlight = { ...flight, date };
    const updFlights = [updFlight, ...this.state().flights.slice(1)];

    this.state.update(state => ({
      ...state,
      flights: updFlights
    }));
  }
}
