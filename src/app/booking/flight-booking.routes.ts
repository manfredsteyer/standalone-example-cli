import { importProvidersFrom, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { provideState, StoreModule } from '@ngrx/store';
import { AuthService } from '../shared/auth.service';
import { BookingEffects } from './+state/effects';
import { bookingFeature } from './+state/reducers';
import { FlightBookingComponent } from './flight-booking.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';

export const FLIGHT_BOOKING_ROUTES: Routes = [
  {
    providers: [
      provideState(bookingFeature),
      provideEffects(BookingEffects),
      // importProvidersFrom(StoreModule.forFeature(bookingFeature)),
      // importProvidersFrom(EffectsModule.forFeature([BookingEffects])),
    ],
    path: '',
    component: FlightBookingComponent,
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
