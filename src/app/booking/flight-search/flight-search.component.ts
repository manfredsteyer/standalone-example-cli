import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { selectFlights } from '../+state/selectors';
import { delayFlight, loadFlights } from '../+state/actions';
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
})
export class FlightSearchComponent implements OnInit {
  
  store = inject(Store);
  flights = toSignal(this.store.select(selectFlights), { initialValue: [] });
  from = signal('Hamburg');
  to = signal('Graz');
  basket = signal<Record<number, boolean>>({ 1: true });
  urgent = signal(false);

  ngOnInit(): void {}

  search(): void {
    if (!this.from() || !this.to()) return;

    this.store.dispatch(
      loadFlights({ from: this.from(), to: this.to() })
    );
  }

  // Just delay the first flight
  delay(): void {
    const flights = this.flights();
    const id = flights[0].id;
    this.store.dispatch(delayFlight({ id }));
  }
}
