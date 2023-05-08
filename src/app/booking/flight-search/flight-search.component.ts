import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, Injector, NgZone, OnInit, runInInjectionContext, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { createSolidStore } from 'src/app/store-utils';

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
  private flightService = inject(FlightService);

  private element = inject(ElementRef);
  private zone = inject(NgZone);

  store = createSolidStore({
    flights: [] as Flight[],
    from: 'Hamburg',
    to: 'Graz',
    basket: { 1: true } as Record<number, boolean>,
    urgent: false,
  })

  // Just for convenience
  state = this.store.state;

  constructor() {

    effect(() => {
      this.blink();
      console.log('flights array changed', this.state.flights)
    });

  }

  ngOnInit(): void {
  }

  async search(): Promise<void> {
    if (!this.state.from || !this.state.to) {
      return;
    }
    const flights = await this.flightService.findAsPromise(this.state.from, this.state.to);
    this.store.set('flights', flights);
  }

  // Just delay the first flight
  delay(): void {
    const f = this.state.flights[0];
    const date = addMinutes(f.date, 15);
    this.store.set('flights', 0, {...f, date});
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
