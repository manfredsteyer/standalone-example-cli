import { Routes } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import { BookingEffects } from "./+state/effects";
import { bookingFeature } from "./+state/reducers";
import { FlightBookingComponent } from "./flight-booking.component";
import { FlightEditComponent } from "./flight-edit/flight-edit.component";
import { FlightSearchComponent } from "./flight-search/flight-search.component";
import { PassengerSearchComponent } from "./passenger-search/passenger-search.component";

export const FLIGHT_BOOKING_ROUTES: Routes = [{
    path: '',
    component: FlightBookingComponent,
    providers: [
        provideState(bookingFeature),
        provideEffects([BookingEffects])
    ],
    children: [
        {
            path: 'flight-search',
            component: FlightSearchComponent
        },
        {
            path: 'passenger-search',
            component: PassengerSearchComponent
        },
        {
            path: 'flight-edit/:id',
            component: FlightEditComponent
        }
    ]
}];

