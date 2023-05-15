import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from 'src/app/shared/util-common';
import { FlightCardComponent } from '../../ui-common';
import { ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ticketingActions, ticketingFeature } from '../../data';

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,

    FormsModule,
    FlightCardComponent,
    CityValidator,
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent {
  private store = inject(Store);

  criteria = this.store.selectSignal(ticketingFeature.selectCriteria);
  basket = this.store.selectSignal(ticketingFeature.selectBasket);
  flights = this.store.selectSignal(ticketingFeature.selectFlights);

  async search() {
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

  updateCriteria(from: string, to: string): void {
    this.store.dispatch(ticketingActions.updateCriteria({ from, to }));
  }

  updateBasket(id: number, selected: boolean): void {
    this.store.dispatch(ticketingActions.updateBasket({ id, selected }));
  }
}
