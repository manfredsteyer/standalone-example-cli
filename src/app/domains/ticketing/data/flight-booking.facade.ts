import { Injectable, computed, inject } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes } from 'src/app/shared/util-common';
import {
  signalState,
  patchState,
} from '@ngrx/signals';

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {
  private flightService = inject(FlightService);

  private state = signalState({
    from: 'Paris',
    to: 'London',
    preferences: {
      directConnection: false,
      maxPrice: 350,
    },    
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  });

  // fetch root signals as readonly
  flights = this.state.flights;
  from = this.state.from;
  to = this.state.to;

  pref = this.state.preferences;

  basket = this.state.basket;

  // fetch selected signal
  selected = computed(
    () => this.flights().filter((f) => this.basket()[f.id])
  );

  updateCriteria(from: string, to: string): void {
    patchState(this.state, { from, to })
  }

  updateBasket(id: number, selected: boolean): void {
    patchState(this.state, state => ({
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

    patchState(this.state, { flights });
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];

    const date = addMinutes(flight.date, 15);
    const updFlight = { ...flight, date };
    const updFlights = [updFlight, ...this.state.flights().slice(1)];

    patchState(this.state, { flights: updFlights });
  }
}
