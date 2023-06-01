import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Flight, FlightService} from "../../data";
import {CityValidator, addMinutes} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";

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
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent  {

  private flightService = inject(FlightService);

  from = 'Paris'; 
  to = 'London'; 

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
    const date = addMinutes(this.flights[0].date, 15);
    this.flights[0].date = date.toISOString();
  }
}
