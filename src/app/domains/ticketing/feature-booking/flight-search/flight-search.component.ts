import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  untracked,
  effect,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight, FlightService } from '../../data';
import { CityValidator, addMinutes } from 'src/app/shared/util-common';
import { FlightCardComponent } from '../../ui-common';
import {
  toObservable,
  toSignal,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, filter, interval, startWith } from 'rxjs';

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
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent {
  private flightService = inject(FlightService);

  from = signal('Paris');
  to = signal('London');

  from$ = toObservable(this.from);
  to$ = toObservable(this.to);

  criteria$ = combineLatest({
    from: this.from$,
    to: this.to$,
    dummy: interval(1000),
  }).pipe(
    filter((combi) => combi.from.length >= 3 && combi.to.length >= 3),
    debounceTime(300)
    // startWith({ from: '', to: ''})
  );

  criteria = toSignal(this.criteria$, {
    initialValue: {
      from: '',
      to: '',
      dummy: -1,
    },
  });

  // criteria2 = toSignal(this.criteria$, {
  //   requireSync: true
  // });

  // flightRoute = computed(() => this.from() + ' to ' + untracked(() => this.to()));
  flightRoute = computed(() => this.from() + ' to ' + this.to());

  flights = signal<Flight[]>([]);

  constructor() {
    this.criteria$
      .pipe(takeUntilDestroyed())
      .subscribe((v) => console.log('criteria$', v.dummy));

    // effect(() => {
    //   const from = this.from();
    //   this.to.set(from);
    // }, { allowSignalWrites: true })

    effect(() => {
      console.log('dummy', this.criteria().dummy);
    });

    effect(() => {
      console.log('from', this.from());
      console.log('to', this.to());
    });

    setTimeout(() => {
      this.from.set('Vienna'); // Glitch-free  // Push-Pull
      // Glitch: Vienna - London
      this.to.set('Hamburg');
    }, 2000);

    effect(() => {
      this.search();
    });
  }

  injector = inject(Injector);

  // ngOnInit() {
    // runInInjectionContext(this.injector, () => {
    //   effect(() => {
    //     console.log('dummy', this.criteria().dummy);
    //   });
    // })

    // effect(() => {
    //   console.log('dummy', this.criteria().dummy);
    // }, { injector: this.injector });
  // }

  async search() {
    const { from, to } = this.criteria();

    if (!from || !to) return;
    const flights = await this.flightService.findPromise(from, to);
    this.flights.set(flights);
  }

  delay(): void {
    const flights = this.flights();
    const date = addMinutes(flights[0].date, 15);

    // this.flights.mutate(flights => {
    //   flights[0].date = date.toISOString();
    // });

    // Immutables
    this.flights.update((flights) => [
      { ...flights[0], date: date.toISOString() },
      ...flights.slice(1),
    ]);
  }
}
