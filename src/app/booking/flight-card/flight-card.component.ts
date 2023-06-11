import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy, Signal, effect, signal, inject, ElementRef, NgZone, WritableSignal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CityPipe } from "@demo/shared";
import { Flight, initFlight } from "@demo/data";
import { DeepSignal, nest, toReadOnly } from "src/app/utils";

@Component({
  standalone: true,
  selector: 'flight-card',
  imports: [CommonModule, RouterModule, CityPipe],
  templateUrl: './flight-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightCardComponent implements OnChanges {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  @Input() item!: Signal<DeepSignal<Flight>>;
  @Input() selected!: boolean;
  @Output() selectedChange = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges) {
  }

  select() {
    this.selectedChange.next(true);
  }

  deselect() {
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

