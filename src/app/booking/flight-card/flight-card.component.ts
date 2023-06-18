import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy, Signal, inject, ElementRef, NgZone } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CityPipe } from "@demo/shared";
import { Flight } from "@demo/data";
import { DeepSignal } from "src/app/store";

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
  @Input() selected!: Signal<DeepSignal<boolean>>;
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

