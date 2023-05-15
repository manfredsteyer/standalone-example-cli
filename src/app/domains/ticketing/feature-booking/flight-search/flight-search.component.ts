import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Component, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {take} from "rxjs";
import {CityValidator} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";
import { Flight, FlightService } from "../../data";

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

  from = signal('Hamburg');
  to = signal('Graz');
  flights = signal<Flight[]>([]);

  async search() {
    if (!this.from() || !this.to()) return;

    const flights = await this.flightService.findPromise(this.from(), this.to());
    this.flights.set(flights);
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];

    const date = addMinutes(flight.date, 15);

  }

}
