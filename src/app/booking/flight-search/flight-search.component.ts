import { Component, inject, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Flight, FlightService } from '@demo/data';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);
  private route = inject(ActivatedRoute);

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;

  flights: Flight[] = [];

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  constructor() {
    this.route.paramMap.subscribe((p) => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.from = from;
        this.to = to;
        this.search();
      }
    });
  }

  ngOnInit(): void {}

  search(): void {
    if (!this.from || !this.to) return;

    this.flightService
      .find(this.from, this.to, this.urgent)
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
