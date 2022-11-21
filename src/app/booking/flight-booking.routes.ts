import { provideHttpClient, withInterceptors, withRequestsMadeViaParent } from "@angular/common/http";
import { Routes } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import { BookingEffects } from "./+state/effects";
import { bookingFeature } from "./+state/reducers";
import { FlightBookingComponent } from "./flight-booking.component";
import { FlightEditComponent } from "./flight-edit/flight-edit.component";
import { FlightSearchComponent } from "./flight-search/flight-search.component";
import { PassengerSearchComponent } from "./passenger-search/passenger-search.component";
import { bookingInterceptor } from "./utils/booking.interceptor";

export const FLIGHT_BOOKING_ROUTES: Routes = [{
    path: '',
    component: FlightBookingComponent,
    providers: [
        // NGRX
        provideState(bookingFeature),
        provideEffects([BookingEffects]),

        // Http
        provideHttpClient(
            withInterceptors([bookingInterceptor]),
            withRequestsMadeViaParent(),
        ),
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

export default FLIGHT_BOOKING_ROUTES;
