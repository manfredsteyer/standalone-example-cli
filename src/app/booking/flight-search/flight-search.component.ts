import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  NgZone,
  OnInit,
  Signal,
  computed,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import {
  selectBooking,
  selectFlightById,
  selectFlightIds,
  selectFlights,
  selectFlightsNested,
  selectNestedFlights,
  selectOtherStuff,
} from '../+state/selectors';
import { loadFlights } from '../+state/actions';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent implements OnInit {
  private element = inject(ElementRef);
  private zone = inject(NgZone);

  private injector = inject(Injector);

  store = inject(Store);

  // store.selectSignal fires too often
  flights = toSignal(
    this.store.select(selectNestedFlights((id) => this.selectFlightById(id))),
    { requireSync: true }
  );

  from = signal('Hamburg');
  to = signal('Graz');
  basket = signal<Record<number, boolean>>({ 1: true });
  urgent = signal(false);

  constructor() {
    // this.otherStuff$.subscribe(x => this.blink());
    effect(() => {
      console.log('flights updated', this.flights());
      this.blink();
    });
  }

  private selectFlightById(id: number) {
    let signal!: Signal<any>;

    // toSignal must run in an injection context
    // store.selectSignal fires too often
    runInInjectionContext(this.injector, () => {
      signal = toSignal(this.store.select(selectFlightById(id)), {
        requireSync: true,
      });
    });
    return signal;
  }

  ngOnInit(): void {}

  search(): void {
    if (!this.from() || !this.to()) return;

    this.store.dispatch(loadFlights({ from: this.from(), to: this.to() }));
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
