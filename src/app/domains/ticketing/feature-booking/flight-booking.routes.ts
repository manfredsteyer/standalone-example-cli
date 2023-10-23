import {inject} from '@angular/core';
import {Routes} from '@angular/router';
import {AuthService} from '../../../shared/util-auth';
import {FlightBookingComponent} from './flight-booking.component';
import {FlightEditComponent} from './flight-edit/flight-edit.component';
import {FlightSearchComponent} from './flight-search/flight-search.component';
import {PassengerSearchComponent} from './passenger-search/passenger-search.component';

export const FLIGHT_BOOKING_ROUTES: Routes = [
  {
    path: '',
    component: FlightBookingComponent,
    canActivate: [() => inject(AuthService).isAuthenticated()],
    providers: [
    ],
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
