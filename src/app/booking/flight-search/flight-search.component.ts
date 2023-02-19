import { AsyncPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CityValidator } from "@demo/shared";
import { FlightCardComponent } from "../flight-card/flight-card.component";
import { ActivatedRoute } from "@angular/router";
import { signal } from "src/app/signals";
import { effect } from "src/app/signals/effect";
import { addMinutes } from "src/app/date-utils";
import { fromStore } from "src/app/utils";
import { selectFlights } from "../+state/selectors";
import { Store } from "@ngrx/store";
import { loadFlights } from "../+state/actions";

type ComponentState = {
  from: string;
  to: string;
  urgent: boolean;
  basket: Record<number, boolean>;
};

const initState: ComponentState = {
  from: 'Hamburg',
  to: 'Graz',
  urgent: false,
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

  private route = inject(ActivatedRoute);

  store = inject(Store);
  flights = fromStore(selectFlights)
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

  search(): void {
    if (!this.state().from || !this.state().to) return;

    this.store.dispatch(loadFlights(this.state().from, this.state().to));
  }

  // Just delay the first flight
  delay(): void {
    
  }
}

