import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Flight, FlightService } from '@demo/data';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { JsonPipe } from '@angular/common';
import { CityValidator } from '../../shared/city.validator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CityValidator,
    FlightCardComponent,
    JsonPipe
],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria
  flights = signal<Flight[]>([]);
  basket = signal<Record<number, boolean>>({});

  selected = computed(() => this.flights().filter(f => this.basket()[f.id]));

  ngOnInit(): void { }

  search(): void {
    if (!this.from() || !this.to()) return;

    this.flightService
      .find(this.from(), this.to())
      .subscribe((flights) => {
        this.flights.set(flights);
      });
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.basket.update(basket => ({
      ...basket,
      [flightId]: selected
    }));
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];
    const date = new Date(flight.date);

    const newDate = new Date(date.getTime() + 1000 * 60 * 15);
    const newFlight = { ...flight, date: newDate.toISOString() };
    const newFlights = [newFlight, ...flights.slice(1)];

    this.flights.set(newFlights);
  }
}
