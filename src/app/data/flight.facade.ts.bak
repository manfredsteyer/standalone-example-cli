import { Injectable, inject } from '@angular/core';
import { Flight } from './flight';
import { FlightService } from './flight.service';
import { lastValueFrom } from 'rxjs';
import { signalState } from '../shared/signal-store/signal-state';
import { selectSignal } from '../shared/signal-store/select-signal';
import { patchState } from '../shared/signal-store/patch-state';

@Injectable({ providedIn: 'root' })
export class FlightFacade {
  private flightService = inject(FlightService);

  private state = signalState({
    from: 'Graz',
    to: 'Hamburg',
    urgent: false,
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  });

  readonly from = this.state.from;
  readonly to = this.state.to;
  readonly urgent = this.state.urgent;
  readonly flights = this.state.flights;
  readonly basket = this.state.basket;

  readonly selected = selectSignal(
    this.flights,
    this.basket,
    (flights, basket) => flights.filter((f) => basket[f.id])
  );

  async load(): Promise<void> {
    const flights = await lastValueFrom(
      this.flightService.find(this.from(), this.to(), this.urgent())
    );

    patchState(this.state, { flights });
  }

  updateCriteria(criteria: { from?: string; to?: string }): void {
    patchState(this.state, { from: criteria.from, to: criteria.to });
  }

  updateBasket(flightId: number, selected: boolean): void {
    patchState(this.state, (state) => ({
      basket: {
        ...state.basket,
        [flightId]: selected,
      },
    }));
  }
}
