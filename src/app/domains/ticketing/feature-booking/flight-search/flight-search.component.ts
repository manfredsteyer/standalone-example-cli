import { AsyncPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Flight, FlightService } from "../../data";
import { CityValidator, FormUpdateDirective, addMinutes } from "src/app/shared/util-common";
import { FlightCardComponent } from "../../ui-common";
import { Criteria } from "../criteria";
import { BookingStore } from "../booking.store";

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

  private store = inject(BookingStore);

  from = this.store.from;
  to = this.store.to;
  flights = this.store.flights;
  basket = this.store.basket;

  loading = this.store.loading;

  updateCriteria(c: Criteria): void {
    
    this.store.updateCriteria(c);

  }

  updateBasket(flightId: number, selected: boolean): void {
    this.updateBasket(flightId, selected);
  }

  async search(): Promise<void> {
    if (!this.from() || !this.to()) return;
    this.store.load();
  }

  delay(): void {
    this.store.delay();
  }

}
