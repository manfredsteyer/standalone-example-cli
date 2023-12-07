import { AsyncPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Flight, FlightService } from "../../data";
import { CityValidator, FormUpdateDirective, addMinutes } from "src/app/shared/util-common";
import { FlightCardComponent } from "../../ui-common";
import { Criteria } from "../criteria";

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
    FormUpdateDirective,
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {

  private flightService = inject(FlightService);

  from = signal('Hamburg');
  to = signal('London');
  flights = signal<Flight[]>([]);

  basket = signal<Record<number, boolean>>({
    7: true,
    8: false
  });

  updateCriteria(c: Criteria): void {
    this.from.set(c.from);
    this.to.set(c.to);
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.basket.update(basket => ({
      ...basket,
      [flightId]: selected
    }));
  }

  async search(): Promise<void> {
    if (!this.from() || !this.to()) return;
    const flights = await this.flightService.findPromise(this.from(), this.to());
    this.flights.set(flights);
  }

  delay(): void {
    this.flights.update(flights => ([
      { 
        ...flights[0], 
        date: addMinutes(flights[0].date, 15) 
      },
      ...flights.slice(1)
    ]));
  }

}
