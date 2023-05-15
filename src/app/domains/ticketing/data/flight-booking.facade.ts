import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ticketingFeature } from './+state/reducers';
import { ticketingActions } from './+state/actions';

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {
  private store = inject(Store);

  criteria = this.store.selectSignal(ticketingFeature.selectCriteria);
  basket = this.store.selectSignal(ticketingFeature.selectBasket);
  flights = this.store.selectSignal(ticketingFeature.selectFlights);

  updateCriteria(from: string, to: string): void {
    this.store.dispatch(ticketingActions.updateCriteria({ from, to }));
  }

  updateBasket(id: number, selected: boolean): void {
    this.store.dispatch(ticketingActions.updateBasket({ id, selected }));
  }

  async load() {
    if (!this.criteria().from || !this.criteria().to) return;
    this.store.dispatch(
      ticketingActions.loadFlights({
        from: this.criteria().from,
        to: this.criteria().to,
      })
    );
  }

  delay(): void {
    const flights = this.flights();
    const id = flights[0].id;
    this.store.dispatch(ticketingActions.delayFlight({ id }));
  }
}
