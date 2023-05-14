import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { nest, toReadOnly } from 'src/app/utils';
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

  private injector = inject(Injector);

  _state = nest({
    from: 'Hamburg',
    to: 'Graz',
    urgent: false,
    flights: [] as Flight[],
    basket: {
      3: true,
      5: true,
    } as Record<number, boolean>,
  });

  state = toReadOnly(this._state, this.injector);

  ngOnInit(): void {

    for(let flightSignal of this.state.flights()) {
      console.log('id', flightSignal().id());
    }
  }

  async search() {
    console.log(this.state.from(), this.state.to(), this.state.urgent());

    if (!this.state.from() || !this.state.to()) return;

    const flights = await firstValueFrom(
      this.flightService.find(
        this.state.from(),
        this.state.to(),
        this.state.urgent()
      )
    );

    for (let f of flights) {
      if (!this.state.basket()[f.id]) {
        this._state.basket()[f.id] = signal(false);
      }
    }

    const nested = nest(flights);
    this._state.flights.set(nested);
  }

  delay(): void {
    const flight = this._state.flights()[0]();
    flight.date.set(addMinutes(flight.date(), 15));
  }

  get basketKeys() {
    return Object.keys(this.state.basket());
  }
}
