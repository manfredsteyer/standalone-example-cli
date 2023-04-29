import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Flight,
  FlightService,
} from '../../data';
import { CityValidator } from 'src/app/shared/util-common';
import { FlightCardComponent } from '../../ui-common';
import { ChangeDetectionStrategy } from '@angular/core';
import { addMinutes } from 'src/app/shared/util-common/date-utils';

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
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);

  @Input() q = '';

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria
  flightRoute = computed(() => this.from() + ' to ' + this.to());

  urgent = signal(false);
  flights = signal<Flight[]>([]);
  basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });

  constructor() {
    effect(() => {
      this.search();
    });
  }

  ngOnInit(): void {
    if (this.q) {
      console.log('q');
      const [from, to] = this.q.split('-');
      this.from.set(from);
      this.to.set(to);
    }
  }

  async search() {
    if (!this.from() || !this.to()) return;
    const flights = await this.flightService.findPromise(this.from(), this.to());
    this.flights.set(flights);
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];
    this.flights.mutate(flights => {
      flights[0].date = addMinutes(flight.date, 15);
    });
  }
}
