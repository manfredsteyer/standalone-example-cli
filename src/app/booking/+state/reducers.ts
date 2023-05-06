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
    otherStuff: number[];
}

export const initialState: BookingState = {
    flights: {},
    flightIds: [],
    otherStuff: [1,2,3]
}

export const bookingFeature = createFeature({
    name: BOOKING_FEATURE_KEY,
    reducer: createReducer(
        initialState,
        on(loadFlightsSuccess, (state, action) => {
        
            const flights = action.flights.reduce((acc, f) => {
                return {
                    ...acc,
                    [f.id]: f
                }
            }, {});

            const flightIds = action.flights.map(f => f.id);

            return {
                ...state,
                flights,
                flightIds
            }

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
