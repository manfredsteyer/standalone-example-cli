import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Flight, initFlight } from "@demo/data";

@Component({
  selector: 'flight-card',
  templateUrl: './flight-card.component.html',
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
