import { Injectable, computed, inject, signal } from '@angular/core';
import { Flight } from './flight';
import { FlightService } from './flight.service';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightFacade {
  private flightService = inject(FlightService);

  private state = signal({
    from: 'Graz',
    to: 'Hamburg',
    urgent: false,
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  });

  readonly from = computed(() => this.state().from);
  readonly to = computed(() => this.state().to);
  readonly urgent = computed(() => this.state().urgent);
  readonly flights = computed(() => this.state().flights);
  readonly basket = computed(() => this.state().basket);

  readonly selected = computed(() =>
    this.state().flights.filter((f) => this.state().basket[f.id])
  );

  async load(): Promise<void> {
    const flights = await lastValueFrom(
      this.flightService.find(this.from(), this.to(), this.urgent())
    );

    this.state.update((state) => ({
      ...state,
      flights,
    }));
  }

  updateCriteria(criteria: { from?: string; to?: string }): void {
    this.state.update((state) => ({
      ...state,
      from: criteria.from || state.from,
      to: criteria.to || state.to,
    }));
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.state.update((state) => ({
      ...state,
      basket: {
        ...state.basket,
        [flightId]: selected,
      },
    }));
  }


}
