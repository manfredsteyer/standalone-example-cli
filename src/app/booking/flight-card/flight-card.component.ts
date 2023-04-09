import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CityPipe } from "@demo/shared";
import { Flight, initFlight } from "@demo/data";

@Component({
  standalone: true,
  selector: 'flight-card',
  imports: [CommonModule, RouterModule, CityPipe],
  templateUrl: './flight-card.component.html',
})
export class FlightCardComponent implements OnChanges {
  
  @Input() item: Flight = initFlight;
  @Input() selected: boolean | undefined;
  @Output() selectedChange = new EventEmitter<boolean>();
  @Input() showEditButton = true;

  ngOnChanges(changes: SimpleChanges) {
    (window as any).item = this.item;
  }

  select() {
    this.selected = true;
    this.selectedChange.next(true);
  }

  deselect() {
    this.selected = false;
    this.selectedChange.next(false);
  }
}
