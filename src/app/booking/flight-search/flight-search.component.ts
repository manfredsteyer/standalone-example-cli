import { AsyncPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CityValidator } from "@demo/shared";
import { FlightCardComponent } from "../flight-card/flight-card.component";
import { ActivatedRoute } from "@angular/router";
import { signal } from "src/app/signals";
import { Flight, FlightService } from "@demo/data";
import { addMinutes } from "src/app/date-utils";

type ComponentState = {
  from: string;
  to: string;
  urgent: boolean;
  flights: Flight[];
  basket: Record<number, boolean>;
};

const initState: ComponentState = {
  from: 'Hamburg',
  to: 'Graz',
  urgent: false,
  flights: [], 
  basket: {
    3: true,
    5: true
  }
}

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

  state = signal(initState);

  constructor() {

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

  // Helper function for data binding
  update(key: string, event: any): void {
    this.state.update(v => ({
      ...v,
      [key]: event.target.value
    }));
  }

  // Helper function for data binding
  updateCheckbox(key: string, event: any): void {
    this.state.update(v => ({
      ...v,
      [key]: event.target.checked
    }));
  }

  async search(): Promise<void> {
    if (!this.state().from || !this.state().to) return;

    const flights = await this.flightService.findAsPromise(
      this.state().from, 
      this.state().to,
      this.state().urgent);

    this.state.mutate(s => {
      s.flights = flights;
    });

  }

  // Just delay the first flight
  delay(): void {
    this.state.mutate(s => {
      const flight = s.flights[0];
      flight.date = addMinutes(flight.date, 15);
    });
  }
}

