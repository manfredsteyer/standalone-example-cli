import { AsyncPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CityValidator } from "@demo/shared";
import { FlightCardComponent } from "../flight-card/flight-card.component";
import { ActivatedRoute } from "@angular/router";
import { computed, signal } from "src/app/signals";
import { Flight, FlightService } from "@demo/data";
import { addMinutes } from "src/app/date-utils";
import { effect } from "src/app/signals/effect";

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
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent implements OnInit {

  private flightService = inject(FlightService);
  private route = inject(ActivatedRoute);

  from = signal('Hamburg');
  to = signal('Graz');
  flights = signal<Flight[]>([]);
  basket = signal<Record<number, boolean>>({ 1: true });
  urgent = signal(false);

  flightRoute = computed(() => this.from() + ' to ' + this.to());

  constructor() {

    this.route.paramMap.subscribe(p => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.from.set(from);
        this.to.set(to);
        this.search();
      }
    });

    setTimeout(() => {
      this.from.set('London');
      this.to.set('Paris');
    }, 2000);

    effect(() => {
      console.log('route:', this.flightRoute())
    });

    effect(() => {
      console.log('result:', this.flights())
    });

  }

  ngOnInit(): void {
  }

  async search(): Promise<void> {
    if (!this.from() || !this.to()) return;

    const flights = await this.flightService.findAsPromise(
      this.from(), 
      this.to(),
      this.urgent());

    this.flights.set(flights);
  }

  // Just delay the first flight
  delay(): void {
    this.flights.mutate(f => {
      const flight = f[0];
      flight.date = addMinutes(flight.date, 15);
    });
  }
}

