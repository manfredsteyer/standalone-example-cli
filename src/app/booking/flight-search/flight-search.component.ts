import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { NgIf, NgFor, JsonPipe } from '@angular/common';
import { CityValidator } from '../../shared/city.validator';
import { FormsModule } from '@angular/forms';
import { FlightStore } from 'src/app/data/flight.store';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CityValidator,
    NgIf,
    NgFor,
    FlightCardComponent,
    JsonPipe,
  ],
})
export class FlightSearchComponent {
  private store = inject(FlightStore);
  private route = inject(ActivatedRoute);

  from = this.store.from;
  to = this.store.to;
  urgent = this.store.urgent;
  selected = this.store.selected;

  loading = this.store.loading;
  flights = this.store.flights;
  basket = this.store.basket;

  constructor() {
    this.route.paramMap.subscribe((p) => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.store.updateCriteria({ from, to });
        this.search();
      }
    });
  }

  async search(): Promise<void> {
    if (!this.from() || !this.to()) return;
    await this.store.load();
  }

  updateCriteria(from?: string, to?: string): void {
    this.store.updateCriteria({ from, to });
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }

  delay(): void {}
}
