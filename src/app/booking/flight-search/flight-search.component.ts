import { Component, inject, OnInit } from '@angular/core';
import { Flight, FlightService } from '@demo/data';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { NgIf, NgFor, JsonPipe } from '@angular/common';
import { CityValidator } from '../../shared/city.validator';
import { FormsModule } from '@angular/forms';

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
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria

  flights: Flight[] = [];

  basket: Record<number, boolean> = {
  };

  ngOnInit(): void {}

  search(): void {
    if (!this.from || !this.to) return;

    this.flightService
      .find(this.from, this.to)
      .subscribe((flights) => {
        this.flights = flights;
      });
  }

  delay(): void {
    const flight = this.flights[0];
    const date = new Date(flight.date);

    date.setTime(date.getTime() + 1000 * 60 * 15);
    flight.date = date.toISOString();
  }
}
