import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Component, WritableSignal, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Store} from "@ngrx/store";
import {take} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {BookingSlice, Flight, FlightService, delayFlight, loadFlights, selectFlights} from "../../data";
import {CityValidator} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";
import { ChangeDetectionStrategy } from "@angular/core";

@Component({
  standalone: true,
  imports: [
    // CommonModule,
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightSearchComponent  {

  private flightService = inject(FlightService);
  private route = inject(ActivatedRoute);

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria
  urgent = signal(false);

  flights: WritableSignal<Flight[]> = signal([]);

  basket: WritableSignal<Record<number, boolean>> = signal({
    3: true,
    5: true
  });

  constructor() {
    this.route.paramMap.subscribe(p => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.from.set(from);
        this.to.set(to);
        this.search();
      }
    });
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.flightService.find(this.from(), this.to()).subscribe(
      flights => {
        this.flights.set(flights);
      }
    );

  }

  delay(): void {
    const flights = this.flights();
    const date = new Date(flights[0].date);
    date.setTime(date.getTime() + 1000 * 60 * 15);

    // Mutable
    // this.flights.mutate(flights => {
    //   flights[0].date = date.toISOString()
    // });
    
    this.flights.update(flights => ([
      { ...flights[0], date: date.toISOString() },
      ...flights.slice(1)
    ]))
    // Immutable
    // const newFlight: Flight = { ...this.flights[0], date: date.toISOString()}
    // const newFlights = [newFlight, ...this.flights.slice(1)];
    // this.flights = newFlights;
  }

}

