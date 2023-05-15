import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { createStore, flatten, navigate, nest } from 'src/app/utils';
import { firstValueFrom } from 'rxjs';

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
  private flightService = inject(FlightService);

  store = createStore({
    criteria: {
      from: 'Hamburg',
      to: 'Graz',
      urgent: false,
    },
    a: {
      b: 1,
      c: {
        d: 2,
        e: {
          f: 1
        }
      }
    },
    flights: [] as Flight[],
    basket: {
      3: true,
      5: true,
    } as Record<number, boolean>,
  });

  flights = this.store.select((s) => s.flights);
  criteria = this.store.select((s) => s.criteria);
  basket = this.store.select((s) => s.basket);

  flightRoute = computed(
    () => this.criteria().from() + ' to ' + this.criteria().to()
  );

  ngOnInit(): void {
    const r = this.store.select(s => navigate(s, 'basket', 3));
    // const r2 = this.store.select(s => s.basket()[0]());

    console.log('r', r());
  }

  update(criteria: string, value: string) {
    this.store.update((s) => (s.criteria as any)[criteria], value);
  }

  updateBasket(item: number, value: boolean) {
    this.store.update((s) => s.basket()[item], value);
  }

  async search() {
    const from = this.criteria().from();
    const to = this.criteria().to();
    const urgent = this.criteria().urgent();

    if (!from || !to) return;

    const flights = await firstValueFrom(
      this.flightService.find(from, to, urgent)
    );

    this.store.update((s) => s.flights, flights);

    for (let f of flights) {
      this.store.update(
        (s) => s.basket,
        (x) => ({ ...x, [f.id]: false })
      );
    }
  }

  delay(): void {
    this.store.update(
      (s) => s.flights()[0]().date,
      (date) => addMinutes(date, 15)
    );

    const flights = this.store.selectFlat(s => s.flights);
      console.log('flights', flights);

    const all = this.store.selectFlat(s => signal(s));
      console.log('all', all);

  }

  get basketKeys() {
    console.log('basket', Object.keys(this.basket()), this.basket());
    return Object.keys(this.basket());
  }
}
