import { CommonModule, NgClass, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Output, inject, input, model, output } from "@angular/core";
import { Flight, initFlight } from "@demo/data";
import { RouterLink } from "@angular/router";
import { CityPipe } from "../../shared/city.pipe";

@Component({
    selector: 'flight-card',
    templateUrl: './flight-card.component.html',
    styleUrl: './flight-card.component.css',
    standalone: true,
    imports: [NgClass, RouterLink, DatePipe, CityPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightCardComponent {
  
  // Signal Queries
  // viewChild, viewChildren, contentChild, contentChildren

  item = input(initFlight);
  selected = model.required<boolean>();
  showEditButton = input(false);
  // selectedChange = output<boolean>();

  private element = inject(ElementRef);
  private zone = inject(NgZone);
  
  select() {
    this.selected.set(true);
    //this.selectedChange.emit(true);
  }

  deselect() {
    this.selected.set(false);
    // this.selectedChange.emit(false);
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
