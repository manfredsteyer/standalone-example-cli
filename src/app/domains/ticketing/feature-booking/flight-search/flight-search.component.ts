import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Component, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CityValidator} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";
import { FlightBookingFacade } from "../../data";
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

  private facade = inject(FlightBookingFacade);

  from = this.facade.from;
  to = this.facade.to;
  basket = this.facade.basket;
  flights = this.facade.flights;

  async search() {
    this.facade.load();
  }

  delay(): void {
    this.facade.delay();
  }

}
