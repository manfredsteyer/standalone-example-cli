import { Flight } from "@demo/data";
import { createFeature, createReducer, on } from "@ngrx/store";
import { delayFlight, loadFlightsSuccess } from "./actions";
import { addMinutes } from "src/app/date-utils";

export const BOOKING_FEATURE_KEY = 'booking';

export interface BookingSlice {
    [BOOKING_FEATURE_KEY]: BookingState
}

export interface BookingState {
    flights: Record<number, Flight>;
    flightIds: number[];
}

export const initialState: BookingState = {
    flights: {},
    flightIds: []
}

export const bookingFeature = createFeature({
    name: BOOKING_FEATURE_KEY,
    reducer: createReducer(
        initialState,
        on(loadFlightsSuccess, (state, action) => {
            return { ...state, flights: action.flights };
        }),
        on(delayFlight, (state, action) => {

            const id = action.id;
            const flight = state.flights[id];
            const newFlight = { ...flight, date: addMinutes(flight.date, 15) };

            const flights = { 
                ...state.flights,
                [id]: newFlight
            }

            return {
                ...state,
                flights
            };

            // const flights = state.flights.map(f => f.id !== action.id ? f : updateDate(f) )
            // return { ...state, flights };
        })
    )
});
