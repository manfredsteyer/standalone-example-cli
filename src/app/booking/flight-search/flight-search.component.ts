import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '@demo/data';
import { fromSignal, fromObservable } from 'src/app/interop';
import { combineLatest, debounceTime, switchMap, tap } from 'rxjs';

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
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);
  private route = inject(ActivatedRoute);

  from = signal('Hamburg');
  to = signal('Graz');
  basket = signal<Record<number, boolean>>({ 1: true });
  urgent = signal(false);

  flightRoute = computed(() => this.from() + ' to ' + this.to());
  loading = signal(false);

  from$ = fromSignal(this.from);
  to$ = fromSignal(this.to);

  flights$ = combineLatest({ from: this.from$, to: this.to$ }).pipe(
    debounceTime(300),
    tap(() => this.loading.set(true)),
    switchMap((combi) => this.flightService.find(combi.from, combi.to)),
    tap(() => this.loading.set(false))
  );

  flights = fromObservable(this.flights$, []);

  constructor() {
    this.route.paramMap.subscribe((p) => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.from.set(from);
        this.to.set(to);
      }
    });

    effect(() => {
      console.log('route:', this.flightRoute());
    });

    effect(() => {
      console.log('result:', this.flights());
    });
  }

  ngOnInit(): void {}
}
