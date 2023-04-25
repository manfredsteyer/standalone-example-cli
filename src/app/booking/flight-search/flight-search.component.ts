import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { ActivatedRoute } from '@angular/router';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { state } from 'src/app/utils';
import { firstValueFrom } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);
  private route = inject(ActivatedRoute);

  state = state({
    from: 'Hamburg',
    to: 'Graz',
    urgent: false,
    flights: [
    ] as Flight[],
    basket: {
      3: true,
      5: true,
    },
  });

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

    this.state.flights = 
      await firstValueFrom(
        this.flightService.find(
          this.state.from,
          this.state.to,
          this.state.urgent
        )
      );
  }

  // Just delay the first flight
  delay(): void {
    const flight = this.state.flights[0];
    flight.date = addMinutes(flight.date, 15);
  }
}
