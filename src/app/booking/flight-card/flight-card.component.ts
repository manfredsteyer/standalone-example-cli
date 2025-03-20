import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, inject } from "@angular/core";
import { Flight, initFlight } from "@demo/data";

@Component({
    selector: 'flight-card',
    templateUrl: './flight-card.component.html',
    styleUrl: './flight-card.component.css',
    standalone: false
})
export class FlightCardComponent {
  
  @Input() item: Flight = initFlight;
  @Input() selected: boolean | undefined;
  @Output() selectedChange = new EventEmitter<boolean>();
  @Input() showEditButton = true;

  private element = inject(ElementRef);
  private zone = inject(NgZone);
  
  select() {
    this.selected = true;
    this.selectedChange.next(true);
  }

  deselect() {
    this.selected = false;
    this.selectedChange.next(false);
  }

  blink() {
    // Dirty Hack used to visualize the change detector
    this.element.nativeElement.firstChild.style.backgroundColor = 'crimson';

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.element.nativeElement.firstChild.style.backgroundColor = 'white';
      }, 1000);
    });

    return null;
  }
}
