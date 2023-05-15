import { Injectable, inject, signal } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes } from 'src/app/shared/util-common';

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {
  private flightService = inject(FlightService);

  private _flights = signal<Flight[]>([]);
  readonly flights = this._flights.asReadonly();

  async load(from: string, to: string) {
    const flights = await this.flightService.findPromise(from, to);
    this._flights.set(flights);
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];

    const date = addMinutes(flight.date, 15);

    this._flights.update((flights) => [
      { ...flight, date },
      ...flights.slice(1),
    ]);
  }
}
