import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { selectFlights } from '../+state/selectors';
import { loadFlights } from '../+state/actions';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,
    FormsModule,
    FlightCardComponent,
    CityValidator,
  ],
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightSearchComponent implements OnInit {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  store = inject(Store);
  flights = this.store.selectSignal(selectFlights);
  
  from = signal('Hamburg');
  to = signal('Graz');
  basket = signal<Record<number, boolean>>({ 1: true });
  urgent = signal(false);

  constructor() {

  }

  ngOnInit(): void {}

  search(): void {
    if (!this.from() || !this.to()) return;

    this.store.dispatch(
      loadFlights({ from: this.from(), to: this.to() })
    );
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
