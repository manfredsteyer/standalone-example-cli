import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { BookingEffects } from './+state/effects';
import { bookingFeature } from './+state/reducers';
import FLIGHT_BOOKING_ROUTES from './flight-booking.routes';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        StoreModule.forFeature(bookingFeature),
        EffectsModule.forFeature([BookingEffects]),
        RouterModule.forChild(FLIGHT_BOOKING_ROUTES),
    ],
    exports: [],
    declarations: [
        FlightCardComponent,
        FlightSearchComponent,
        FlightEditComponent,
        PassengerSearchComponent
    ],
    providers: [],
})
export class FlightBookingModule { }

