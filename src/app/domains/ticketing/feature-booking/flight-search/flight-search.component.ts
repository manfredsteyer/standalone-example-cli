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

  from = signal('Hamburg');
  to = signal('Graz');
  basket = signal<Record<number, boolean>>({});

  flights = this.facade.flights;

  async search() {
    if (!this.from() || !this.to()) return;
    this.facade.load(this.from(), this.to());
  }

  delay(): void {
    this.facade.delay();
  }

}
