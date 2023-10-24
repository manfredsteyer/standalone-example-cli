import { Injectable, computed, inject, signal } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes, equal, patchSignal } from 'src/app/shared/util-common';

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
    patchSignal(this.state, { from, to });
  }

  updateBasket(id: number, selected: boolean): void {
    patchSignal(this.state, {
      basket: {
        ...this.state().basket,
        [id]: selected,
      }
    })
  }

  async load() {
    if (!this.from() || !this.to()) return;
    const flights = await this.flightService.findPromise(
      this.from(),
      this.to()
    );
    
    patchSignal(this.state, { flights });
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];

    const date = addMinutes(flight.date, 15);
    const updFlight = { ...flight, date };
    const updFlights = [updFlight, ...this.state().flights.slice(1)];
    
    patchSignal(this.state, { flights: updFlights  });
  }
}
