import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CityValidator} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";
import { ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";

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
  private store = inject(Store);

  from = this.store.select()
  to = this.facade.to;
  basket = this.facade.basket;
  flights = this.facade.flights;

  async search() {
    this.facade.load();
  }

  delay(): void {
    this.facade.delay();
  }

  updateCriteria(from: string, to: string): void {
    this.facade.updateCriteria(from, to);
  }

  updateBasket(id: number, selected: boolean): void {
    this.facade.updateBasket(id, selected);
  }
}
