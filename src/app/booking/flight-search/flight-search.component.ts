import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { ActivatedRoute } from '@angular/router';
import { signal } from 'src/app/signals';
import { Flight, FlightService } from '@demo/data';
import { effect } from 'src/app/signals/effect';
import { addMinutes } from 'src/app/date-utils';
import { flatten, nest, state } from 'src/app/utils';
import { firstValueFrom } from 'rxjs';

type ComponentState = {
  from: string;
  to: string;
  urgent: boolean;
  flights: Flight[];
  basket: Record<number, boolean>;
};

const initState: ComponentState = {
  from: 'Hamburg',
  to: 'Graz',
  urgent: false,
  flights: [
    {
      id: 1,
      from: 'G',
      to: 'H',
      date: '2022-02-02',
      delayed: false,
    },
  ],
  basket: {
    3: true,
    5: true,
  },
};

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
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);
  private route = inject(ActivatedRoute);

  // state = signal(initState);

  state = state(initState);
  // flat = flatten(this.nested());

  constructor() {
    this.route.paramMap.subscribe((p) => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.state.from = from;
        this.state.to = to;

        this.search();
      }
    });
  }

  ngOnInit(): void {}

  async search() {
    if (!this.state.from || !this.state.to) return;

    this.state.flights = await firstValueFrom(
      this.flightService.find(this.state.from, this.state.to, this.state.urgent)
    );
  }

  // Just delay the first flight
  delay(): void {
    const flight = this.state.flights[0];
    flight.date = addMinutes(flight.date, 15);
  }
}
