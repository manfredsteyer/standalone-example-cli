import {
  provideHttpClient,
  withInterceptors,
  withRequestsMadeViaParent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AuthService } from '../shared/auth.service';
import { withColor } from '../shared/logger/features';
import { DefaultLogAppender } from '../shared/logger/log-appender';
import { LogLevel } from '../shared/logger/log-level';
import { provideCategory, provideLogger } from '../shared/logger/providers';
import { BookingEffects } from './+state/effects';
import { bookingFeature } from './+state/reducers';
import { FlightBookingComponent } from './flight-booking.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';
import { provideBooking } from './provider';
import { bookingInterceptor } from './utils/booking.interceptor';

export const FLIGHT_BOOKING_ROUTES: Routes = [
  {
    path: '',
    component: FlightBookingComponent,
    canActivate: [() => inject(AuthService).isAuthenticated()],
    providers: [
      // NGRX
      provideState(bookingFeature),
      provideEffects([BookingEffects]),

      // provideCategory('booking', DefaultLogAppender),
      provideLogger(
        {
          level: LogLevel.DEBUG,
          bubbleUp: true,
          appenders: [DefaultLogAppender],
        },
        withColor({
          debug: 42,
          error: 43,
          info: 46,
        })
      ),

      // Http
      provideHttpClient(
        withInterceptors([bookingInterceptor]),
        withRequestsMadeViaParent()
      ),
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
