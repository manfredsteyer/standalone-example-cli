import { NgForOf, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FlightCardComponent } from "../../ui-common";
import { FlightBookingFacade } from "../../data";
import { ChangeDetectionStrategy } from "@angular/core";

@Component({
    imports: [
        NgIf,
        NgForOf,
        FormsModule,
        FlightCardComponent,
    ],
    selector: 'app-flight-search',
    templateUrl: './flight-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightSearchComponent {
  private facade = inject(FlightBookingFacade);

  from = this.facade.from;
  to = this.facade.to;
  basket = this.facade.basket;
  flights = this.facade.flights;
  selected = this.facade.selected;

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
