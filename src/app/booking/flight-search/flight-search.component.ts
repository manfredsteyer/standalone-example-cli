import { AsyncPipe, CommonModule, JsonPipe, NgForOf, NgIf, NgFor } from "@angular/common";
import { Component, inject, Inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CityValidator } from "@demo/shared";
import { FlightCardComponent } from "../flight-card/flight-card.component";
import { Store } from "@ngrx/store";
import { BookingSlice } from "../+state/reducers";
import { selectFlights } from "../+state/selectors";
import { take } from "rxjs";
import { loadFlights } from "../+state/actions";
import { delayFlight } from "../+state/actions";
import { ActivatedRoute } from "@angular/router";
import { CityValidator as CityValidator_1 } from "../../shared/city.validator";

@Component({
    selector: 'flight-search',
    templateUrl: './flight-search.component.html',
    standalone: true,
    imports: [FormsModule, CityValidator, NgIf, NgFor, FlightCardComponent, AsyncPipe, JsonPipe]
})
export class FlightSearchComponent implements OnInit {

  private store = inject<Store<BookingSlice>>(Store); 
  private route = inject(ActivatedRoute);

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;
  
  flights$ = this.store.select(selectFlights);

  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  constructor() {
    this.route.paramMap.subscribe(p => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.from = from;
        this.to = to;
        this.search();
      }
    });
  }

  ngOnInit(): void {
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.store.dispatch(loadFlights({
      from: this.from, 
      to: this.to 
    }));
  }

  delay(): void {
    this.flights$.pipe(take(1)).subscribe(flights => {
      const id = flights[0].id;
      this.store.dispatch(delayFlight({id}));
    });
  }

}

