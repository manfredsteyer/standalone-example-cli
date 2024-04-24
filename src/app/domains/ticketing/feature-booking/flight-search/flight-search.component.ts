import { AsyncPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CityValidator, FormUpdateDirective } from "src/app/shared/util-common";
import { FlightCardComponent } from "../../ui-common";
import { Criteria } from "../criteria";
import { FlightBookingStore } from "../flight-booking.store";

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

  private store = inject(FlightBookingStore);

  from = this.store.from;
  to = this.store.to;
  flights = this.store.flights;
  loading = this.store.loading;

  basket = this.store.basket;

  updateCriteria(c: Criteria): void {
    this.store.updateCriteria(c);
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }

  async search(): Promise<void> {
   this.store.load();
  }

  delay(): void {
    // No delays in this demo!
  }

}
