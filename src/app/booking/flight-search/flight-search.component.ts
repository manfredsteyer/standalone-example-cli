import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Flight, FlightService } from '@demo/data';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { NgIf, NgFor, JsonPipe } from '@angular/common';
import { CityValidator } from '../../shared/city.validator';
import { FormsModule } from '@angular/forms';
import { FlightStore } from './flight.store';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightSearchComponent implements OnInit {
  private store = inject(FlightStore);

  from = this.store.from;
  to = this.store.to;
  flights = this.store.flights;
  basket = this.store.basket;

  selected = this.store.selected;

  ngOnInit(): void { }

  search(): void {
    this.store.search();
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }

  delay(): void {
    this.store.delay();
  }
}
