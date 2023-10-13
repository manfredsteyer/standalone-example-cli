import { Component, inject, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Flight, FlightService } from '@demo/data';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { NgIf, NgFor, JsonPipe } from '@angular/common';
import { CityValidator } from '../../shared/city.validator';
import { FormsModule } from '@angular/forms';
import { FlightFacade } from 'src/app/data/flight.facade';

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
  private facade = inject(FlightFacade);
  private route = inject(ActivatedRoute);

  from = this.facade.from;
  to = this.facade.to;
  urgent = this.facade.urgent;
  selected = this.facade.selected;

  flights = this.facade.flights;
  basket = this.facade.basket;

  constructor() {
    this.route.paramMap.subscribe((p) => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.facade.updateCriteria({ from, to });
        this.search();
      }
    });
  }

  async search(): Promise<void> {
    if (!this.from() || !this.to()) return;
    await this.facade.load();
  }

  updateCriteria(from?: string, to?: string): void {
    this.facade.updateCriteria({ from, to });
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.facade.updateBasket(flightId, selected);
  }

  delay(): void {}
}
