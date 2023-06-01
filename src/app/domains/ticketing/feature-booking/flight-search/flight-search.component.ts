import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Flight, FlightService} from "../../data";
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

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;

  flights: Flight[] = [];

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
    this.flights[0].date = date.toISOString();
  }

}

