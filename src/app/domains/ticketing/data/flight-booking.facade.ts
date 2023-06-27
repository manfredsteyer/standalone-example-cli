import { Injectable, inject, signal } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes } from 'src/app/shared/util-common';

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {
  private flightService = inject(FlightService);

  private _flights = signal<Flight[]>([]);
  readonly flights = this._flights.asReadonly();

  private _from = signal('Hamburg');
  readonly from = this._from.asReadonly();
  
  private _to = signal('Graz');
  readonly to = this._to.asReadonly();

  private _basket = signal<Record<number, boolean>>({});
  readonly basket = this._basket.asReadonly();

  updateCriteria(from: string, to: string): void {
    this._from.set(from);
    this._to.set(to);
  }

  updateBasket(id: number, selected: boolean): void {
    this._basket.update(b => ({
      ...b,
      [id]: selected,
    }));
  }
  
  async load() {
    if (!this.from() || !this.to()) return;
    const flights = await this.flightService.findPromise(this.from(), this.to());
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
