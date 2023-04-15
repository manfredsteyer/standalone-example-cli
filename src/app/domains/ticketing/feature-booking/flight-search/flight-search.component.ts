import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Store} from "@ngrx/store";
import {take} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {BookingSlice, Flight, FlightService, delayFlight, loadFlights, selectFlights} from "../../data";
import {CityValidator} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";

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
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent  {

  private flightService = inject(FlightService);
  private route = inject(ActivatedRoute);

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;

  flights: Flight[] = [];

  basket: Record<number, boolean> = {
    3: true,
    5: true
  };

  constructor() {
    this.route.paramMap.subscribe(p => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.from = from;
        this.to = to;
        this.search();
      }
    });
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.flightService.find(this.from, this.to).subscribe(
      flights => {
        this.flights = flights;
      }
    );

  }

  delay(): void {
    const date = new Date(this.flights[0].date);
    date.setTime(date.getTime() + 1000 * 60 * 15);

    // Mutable
    this.flights[0].date = date.toISOString();

    // Immutable
    // const newFlight: Flight = { ...this.flights[0], date: date.toISOString()}
    // const newFlights = [newFlight, ...this.flights.slice(1)];
    // this.flights = newFlights;
  }

}

