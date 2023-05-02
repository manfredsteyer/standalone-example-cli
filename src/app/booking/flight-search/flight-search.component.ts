import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { ActivatedRoute } from '@angular/router';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { isProxy, nest, state } from 'src/app/utils';
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

  state = nest({
    from: 'Hamburg',
    to: 'Graz',
    urgent: false,
    flights: [
    ] as Flight[],
    basket: {
      3: true,
      5: true,
    } as Record<number, boolean>,
  });

   ngOnInit(): void {
    console.log('flights', this.state().flights());
    
  }

  async search() {
    if (!this.state().from() || !this.state().to()) return;

    const flights = await firstValueFrom(
      this.flightService.find(
        this.state().from(),
        this.state().to(),
        this.state().urgent()
      ));

    const nested = nest([]);
    // const test = nest({x: {y: 1}});

    this.state().flights.set(nested);
  }

  // Just delay the first flight
  delay(): void {
    this.state().basket()[2] = signal(true);
    // const flight = this.state().flights()[0]();
    // flight.date.set(addMinutes(flight.date(), 15));
  }

  get basketKeys() {
    return Object.keys(this.state().basket());
  }
}
