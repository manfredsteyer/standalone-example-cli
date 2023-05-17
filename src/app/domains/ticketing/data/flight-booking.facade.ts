import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Flight } from './flight';
import { FlightService } from './flight.service';
import { addMinutes } from 'src/app/shared/util-common';

interface FlightBookingState {
  flights: Flight[];
  criteria: {
    from: string,
    to: string
  };
  basket: Record<number, boolean>;
}

@Injectable({ providedIn: 'root' })
class FlightBookingStore extends ComponentStore<FlightBookingState> {
  constructor() {
    super({
      flights: [] as Flight[],
      criteria: {
        from: 'Graz',
        to: 'Hamburg',
      },
      basket: {} as Record<number, boolean>,
    });
  }
}

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {

  private flightService = inject(FlightService);
  private store = inject(FlightBookingStore);

  criteria = this.store.selectSignal((s) => s.criteria);
  basket = this.store.selectSignal((s) => s.basket);
  flights = this.store.selectSignal((s) => s.flights);

  updateCriteria(from: string, to: string): void {
    this.store.patchState({ criteria: { from, to } });
  }

  updateBasket(id: number, selected: boolean): void {
    this.store.patchState((s) => ({ basket: { ...s.basket, [id]: selected } }));
  }

  async load() {
    const from = this.criteria().from;
    const to = this.criteria().to;

    if (!from || !to) return;
   
    const flights = await this.flightService.findPromise(from, to);
    this.store.patchState({ flights });
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];
    
    const updFlight: Flight = { ...flight, date: addMinutes(flight.date, 15)};
    const updFlights: Flight[] = [
      updFlight,
      ...flights.slice(1)
    ];

    this.store.patchState({ flights: updFlights });
  }
}
