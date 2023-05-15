import { createFeature, createReducer, on } from "@ngrx/store";
import { Flight } from "../flight";
import { addMinutes } from "src/app/shared/util-common";
import { ticketingActions } from "./actions";

export interface BookingState {
    flights: Flight[];
    criteria: {
        from: string;
        to: string;
    }
}

export const initialState: BookingState = {
    flights: [],
    criteria: {
        from: '',
        to: ''
    }
}

function updateDate(flight: Flight): Flight {
    return {...flight, date: addMinutes(flight.date, 15) }
}

export const bookingFeature = createFeature({
    name: 'booking',
    reducer: createReducer(
        initialState,
        on(ticketingActions.flightsLoaded, (state, action) => {
            return { ...state, flights: action.flights };
        }),
        on(ticketingActions.delayFlight, (state, action) => {
            const flights = state.flights.map(f => f.id !== action.id ? f : updateDate(f) )
            return { ...state, flights };
        }),
        on(ticketingActions.updateCriteria, (state, action) => {
            return {
                ...state,
                criteria: {
                    from: action.from,
                    to: action.to
                }
            }
        }),
    )
});
