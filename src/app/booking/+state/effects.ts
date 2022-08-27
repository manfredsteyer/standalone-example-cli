import { Inject, Injectable } from "@angular/core";
import { FlightService } from "@demo/data";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs";
import { loadFlights, loadFlightsSuccess } from "./actions";

@Injectable({
    providedIn: 'root'
})
export class BookingEffects {

    loadFlights$;

    constructor(
        private actions$: Actions, 
        private flightService: FlightService) {
            this.loadFlights$ = createEffect(() => this.actions$.pipe(
                ofType(loadFlights),
                switchMap(a => this.flightService.find(a.from, a.to)),
                map(flights => loadFlightsSuccess({flights}))
            ));
        }
}
