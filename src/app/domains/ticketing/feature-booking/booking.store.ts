import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { Flight, FlightService } from "../data";
import { computed, inject } from "@angular/core";
import { Criteria } from "./criteria";
import { addMinutes } from "src/app/shared/util-common";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, delay, filter, switchMap, tap } from "rxjs";
import { setLoaded, setLoading, withCallState } from "./with-call-state";
import { withDataService } from "./with-data-service";

export type BookingState = {
    from: string;
    to: string;
    flights: Flight[];
    basket: Record<number, boolean>
};

export const BookingStore = signalStore(
    { providedIn: 'root' },
    withDataService() // withDataService<Flights, FlightService, {from: string, to: string}>
);