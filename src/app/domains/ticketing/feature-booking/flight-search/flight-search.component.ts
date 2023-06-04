import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CityValidator} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";
import { FlightBookingFacade, FlightBookingStore } from "../../data";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent  {
  private store = inject(FlightBookingStore);

  from = this.store.from;
  to = this.store.to;
  basket = this.store.basket;
  flights = this.store.flights;
  selected = this.store.selected;
  
  async search() {
    this.store.load();
  }

  delay(): void {
    this.store.delay();
  }

  updateCriteria(from: string, to: string): void {
    this.store.updateCriteria(from, to);
  }

  updateBasket(id: number, selected: boolean): void {
    this.store.updateBasket(id, selected);
  }
}
