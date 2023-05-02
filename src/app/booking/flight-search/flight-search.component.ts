import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, OnInit, runInInjectionContext, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';

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

  from = signal('Hamburg');
  to = signal('Graz');
  flights = signal<Flight[]>([]);

  basket = signal<Record<number, boolean>>({ 1: true });
  urgent = signal(false);

  flightRoute = computed(() => this.from() + ' to ' + this.to());

  injector = inject(Injector);

  constructor() {
    effect(() => {
      console.log('route:', this.flightRoute());
    });

    // effect(() => {
    //   this.search();
    // });

    effect(async () => {
      const flights = await this.flightService.findAsPromise(this.from(), this.to());
      this.flights.set(flights);
    });

    // effect(() => {
    //   // Writing into signals is not allowed here:
    //   this.to.set(this.from());
    // });

    // This would be allowed:
    // effect(() => {
    //   this.to.set(this.from());
    // }, { allowSignalWrites: true })
  }


  ngOnInit(): void {
    // Effects are not allowed here:
    // effect(() => {
    //   console.log('route:', this.flightRoute());
    // });

    runInInjectionContext(this.injector, () => {
      effect(() => {
        console.log('route:', this.flightRoute());
      });
    });
  }

  async search(): Promise<void> {
    if (!this.from() || !this.to()) {
      return;
    }
    const flights = await this.flightService.findAsPromise(this.from(), this.to());
    this.flights.set(flights);
  }

  // Just delay the first flight
  delay(): void {

    this.flights.update(f => {
      const flight = f[0];
      const date = addMinutes(flight.date, 15);
      const updated = {...flight, date};

      return [
        updated,
        ...f.slice(1)
      ];
    });

  }
}
