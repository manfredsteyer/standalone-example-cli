import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CityValidator } from "@demo/shared";
import { FlightCardComponent } from "../flight-card/flight-card.component";
import { Store } from "@ngrx/store";
import { BookingSlice } from "../+state/reducers";
import { selectFlights } from "../+state/selectors";
import { take } from "rxjs";
import { loadFlights } from "../+state/actions";
import { delayFlight } from "../+state/actions";

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FlightCardComponent,
    CityValidator,
  ],
  selector: 'flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent implements OnInit {

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;
  
  flights$ = this.store.select(selectFlights);

  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  constructor(
    @Inject(Store) private store: Store<BookingSlice>) {
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

