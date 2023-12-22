import {inject} from '@angular/core';
import {Routes} from '@angular/router';
import {AuthService} from '../../../shared/util-auth';
import {FlightBookingComponent} from './flight-booking.component';
import {FlightEditComponent} from './flight-edit/flight-edit.component';
import {FlightSearchComponent} from './flight-search/flight-search.component';
import {PassengerSearchComponent} from './passenger-search/passenger-search.component';
import { FlightSearchSimpleComponent } from './flight-search-simple/flight-search-simple.component';
import { FlightEditSimpleComponent } from './flight-edit-simple/flight-edit-simple.component';

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
        path: 'flight-search-simple',
        component: FlightSearchSimpleComponent,
      },
      {
        path: 'passenger-search',
        component: PassengerSearchComponent,
      },
      {
        path: 'flight-edit/:id',
        component: FlightEditComponent,
      },
      {
        path: 'flight-edit-simple/:id',
        component: FlightEditSimpleComponent,
      },

    ],
  },
];

export default FLIGHT_BOOKING_ROUTES;
