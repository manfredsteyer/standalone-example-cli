import { CommonModule, NgClass, NgIf, DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Flight, initFlight } from "@demo/data";
import { CityPipe } from "../../shared/city.pipe";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'flight-card',
    templateUrl: './flight-card.component.html',
    standalone: true,
    imports: [NgClass, NgIf, RouterLink, DatePipe, CityPipe]
})
export class FlightCardComponent {
  
  @Input() item: Flight = initFlight;
  @Input() selected: boolean | undefined;
  @Output() selectedChange = new EventEmitter<boolean>();
  @Input() showEditButton = true;

  select() {
    this.selected = true;
    this.selectedChange.next(true);
  }

  deselect() {
    this.selected = false;
    this.selectedChange.next(false);
  }
}
