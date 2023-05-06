import { Store, createFeatureSelector, createSelector } from "@ngrx/store";
import { BookingState, BOOKING_FEATURE_KEY } from "./reducers";
import { state } from "src/app/utils";
import { toSignal } from "@angular/core/rxjs-interop";
import { Flight } from "@demo/data";
import { Signal } from "@angular/core";

export const selectBooking = createFeatureSelector<BookingState>(BOOKING_FEATURE_KEY);

export const selectFlights = createSelector(
    selectBooking,
    booking => booking.flightIds.map(id => booking.flights[id])
);

export const selectFlightIds = createSelector(
    selectBooking,
    b => b.flightIds
);

export const selectFlightsRecord = createSelector(
    selectBooking,
    b => b.flights
);

export const selectOtherStuff = createSelector(
    (s => ((s as any)[BOOKING_FEATURE_KEY] as BookingState).otherStuff),
    otherStuff => otherStuff
);

export function selectFlightById(id: number) {
    return createSelector(
        selectFlightsRecord,
        r => r[id]
    );
}

export function selectNestedFlights(getFlight: (id:number) => Signal<Flight>) {
    return createSelector(
        selectFlightIds,
        (ids) => ids.map(id => getFlight(id))
    ); 
}

export const selectFlightsNested = createSelector(
    selectFlightIds,
    selectFlightsRecord,
    (ids, record) => ids.map(id => record[id])
);

