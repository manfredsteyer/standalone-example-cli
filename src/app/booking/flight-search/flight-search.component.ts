import { AsyncPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CityValidator } from "@demo/shared";
import { FlightCardComponent } from "../flight-card/flight-card.component";
import { ActivatedRoute } from "@angular/router";
import { signal } from "src/app/signals";
import { Flight, FlightService } from "@demo/data";
import { effect } from "src/app/signals/effect";
import { addMinutes } from "src/app/date-utils";
import { FlightSearchFacade } from "./flight-search.facade";

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

  private facade = inject(FlightSearchFacade);
  private route = inject(ActivatedRoute);

  state = signal({
    from: 'Hamburg',
    to: 'Graz',
    urgent: false,
    flights: [] as Flight[], 
    basket: {
      3: true,
      5: true
    } as Record<string, boolean> 
  });

  constructor() {

    effect(() => {
      this.state.mutate(s => {
        s.flights = this.facade.flights()
      });
    });

    this.route.paramMap.subscribe(p => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
       
        this.state.update(v => ({
          ...v,
          from,
          to,
        }));

        this.search();
      }
    });
  }

  ngOnInit(): void {
  }

  update(key: string, event: any): void {
    this.state.update(v => ({
      ...v,
      [key]: event.target.value
    }));
  }

  updateCheckbox(key: string, event: any): void {
    this.state.update(v => ({
      ...v,
      [key]: event.target.checked
    }));
  }

  search(): void {
    if (!this.state().from || !this.state().to) return;

    this.facade.load(
      this.state().from, 
      this.state().to,
      this.state().urgent);

  }

  // Just delay the first flight
  delay(): void {
    this.state.mutate(s => {
      const flight = s.flights[0];
      flight.date = addMinutes(flight.date, 15);
    });
  }
}

