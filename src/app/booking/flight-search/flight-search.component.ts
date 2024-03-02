import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightService } from '@demo/data';
import { combineLatest, debounceTime, filter, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

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
export class FlightSearchComponent {
  private flightService = inject(FlightService);

  from = signal('Hamburg');
  to = signal('Graz');
  basket = signal<Record<number, boolean>>({ 1: true });
  flightRoute = computed(() => this.from() + ' to ' + this.to());

  from$ = toObservable(this.from);
  to$ = toObservable(this.to);

  flights$ = combineLatest({ from: this.from$, to: this.to$ }).pipe(
    filter(c => c.from.length >= 3 && c.to.length >= 3),
    debounceTime(300),
    switchMap(c => this.flightService.find(c.from, c.to))
  );

  flights = toSignal(this.flights$, {
    initialValue: []
  });
}
