import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { FlightBookingComponent } from './flight-booking.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';
import { provideHttpClient, withInterceptors, withRequestsMadeViaParent } from '@angular/common/http';
import { bookingInterceptor } from './utils/booking.interceptor';
import { FlightService } from '../data/flight.service';

export const FLIGHT_BOOKING_ROUTES: Routes = [
  {
    path: '',
    component: FlightBookingComponent,
    providers: [
      FlightService,
      provideHttpClient(
        withInterceptors([bookingInterceptor]),
        withRequestsMadeViaParent(),
      )
    ],
    canActivate: [() => inject(AuthService).isAuthenticated()],
    children: [
      {
        path: 'flight-search',
        component: FlightSearchComponent,
      },
      {
        path: 'passenger-search',
        component: PassengerSearchComponent,
      },
      {
        path: 'flight-edit/:id',
        component: FlightEditComponent,
      },
    ],
  },
];

export default FLIGHT_BOOKING_ROUTES;
