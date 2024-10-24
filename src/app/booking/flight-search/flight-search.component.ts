import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { Flight, FlightService } from '@demo/data';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '../../shared/city.validator';
import { JsonPipe } from '@angular/common';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/info/info.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, filter, switchMap } from 'rxjs';
import { resource } from 'src/app/shared/resource/resource';
import { linkedSignal } from 'src/app/shared/linked/linked';
import { wait } from 'src/app/shared/resource-utils';
import { rxResource } from 'src/app/shared/resource/rx-resource';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CityValidator,
    FlightCardComponent,
    JsonPipe
],
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);
  private dialog = inject(MatDialog);

  constructor() {

    effect(() => {
      // auto-tracking
      this.logRoute();
    });

    // effect(() => {
    //   // loading flag setzen 
    //   const from = this.from();
    //   const to = this.to();

    //   untracked(() => {
    //     this.flightService.find(from, to, false).subscribe(flights => {
    //       this.flights.set(flights);
    //     });
    //   });

    // // loading flag auf false 

    // });

    // effect(() => {
    //   const flights = this.flights();
    //   if (flights.length === 0) {
    //     return;
    //   }
    //   this.dialog.open(InfoComponent, {
    //     data: flights.length
    //   });
    // });
  }

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria

  basket = signal<Record<number, boolean>>({});

  flightRoute = computed(() => this.from() + ' to ' + this.to());

  delayInMinutes = signal(0);

  filter = computed(() => ({
    from: this.from(),
    to: this.to()
  }));

  // --- ----- Wien -----
  //     --- ----- Berlin -----
  //          --- ---- Graz ------

  // Experimentell ab Angular 19
  private flightResource = resource({
    request: this.filter,
    loader: async (param) => {
      //if (param.previous.status !== 'idle') {
        const filter = param.request;
        await wait(300, param.abortSignal);
        return await this.flightService.findPromise(filter.from, filter.to, param.abortSignal);
      //}
      //return Promise.resolve(undefined);
    }
  });

  // Experimentell ab Angular 19
  private rxFlightResource = rxResource({
    request: this.filter,
    loader: (param) => {
      const filter = param.request;
      return this.flightService.find(filter.from, filter.to);
    }
  });

  flights = computed(() => this.flightResource.value() ?? []);

  delayedFlights = computed(() => toDelayed(this.flights(), this.delayInMinutes()));

  isLoading = computed(() => this.flightResource.isLoading());
  error = this.flightResource.error;

  // from$ = toObservable(this.from);
  // to$ = toObservable(this.to);

  // flights$ = combineLatest({
  //   from: this.from$,
  //   to: this.to$
  // }).pipe(
  //   filter(c => c.from.length >= 3 && c.to.length >= 3),
  //   debounceTime(300),
  //   switchMap(c => this.flightService.find(c.from, c.to))
  //   // TODO: Error Handling
  // )
  // flights = toSignal(this.flights$, {
  //   initialValue: []
  // })

  private logRoute() {
    console.log('from', this.from());
    console.log('to', this.to());
  }

  // 17: true
  // 18: false

  ngOnInit(): void {}

  search(): void {
    this.flightResource.refresh();
    // if (!this.from() || !this.to()) return;

    // this.flightService.find(this.from(), this.to()).subscribe((flights) => {
    //   this.flights.set(flights);
    // });
  }

  updateBasket(flightId: number, selected: boolean): void {
    // const basket = this.basket();
    // const newBasket = {
    //   ...basket,
    //   [flightId]: selected
    //   //17:       true
    // }
    // this.basket.set(newBasket);
    this.basket.update((basket) => ({
      ...basket,
      [flightId]: selected,
      //17:       true
    }));
  }

  delay(): void {

    this.delayInMinutes.update(m => m + 15);

    // TODO: Make Immutable!

  }
}


function toDelayed(flights: Flight[], delayInMinutes: number): Flight[] {

  if (flights.length === 0) {
    return [];
  }

  const oldFlights = flights;
  const oldFlight = oldFlights[0];
  const oldDate = new Date(oldFlight.date);

  const newDate = new Date(oldDate.getTime() + 1000 * 60 * delayInMinutes);
  const newFlight: Flight = {
    ...oldFlight,
    date: newDate.toString()
  };

  const newFlights: Flight[] = [
    newFlight,
    ...oldFlights.slice(1),
  ];

  return newFlights;
}