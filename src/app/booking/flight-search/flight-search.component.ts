import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { createStore, nest } from 'src/app/utils';
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

  ngOnInit(): void {}

  update(criteria: string, value: string) {
    this.store.update((s) => (s.criteria as any)[criteria], value);
  }

  updateBasket(item: number, value: boolean) {
    console.log('basket', item, value);
    this.store.update<Record<number, boolean>>(
      (s) => s.basket()[item] as any,
      value as any);
    
      this.store.update(
        s => s.basket()[item],
        value
      );

    console.log('after update', this.basket()[item]())
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

    this.store.update((s) => {
      const r = s.flights()[0]
      return r;
    }, x => x);


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
      (date: string) => addMinutes(date, 15)
    );

    this.store.update(
      (s) => { 
        const x = s.flights()[0];
        return x;
      },
      x => x
    );
  }

  get basketKeys() {
    console.log('basket', Object.keys(this.basket()), this.basket());
    return Object.keys(this.basket());
  }
}
