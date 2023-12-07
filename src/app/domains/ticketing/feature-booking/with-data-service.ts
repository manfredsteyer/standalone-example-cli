import { patchState, signalStore, signalStoreFeature, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { Flight, FlightService } from "../data";
import { computed, inject } from "@angular/core";
import { Criteria } from "./criteria";
import { addMinutes } from "src/app/shared/util-common";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, delay, filter, switchMap, tap } from "rxjs";
import { setLoaded, setLoading, withCallState } from "./with-call-state";

export type BookingState = {
    from: string;
    to: string;
    flights: Flight[];
    basket: Record<number, boolean>
};

export function withDataService() {
    return signalStoreFeature(
        withState<BookingState>({
            from: 'Hamburg',
            to: 'London',
            flights: [],
            basket: {}
        }),
        withComputed((store) => ({
            selected: computed(() => store.flights().filter(f => store.basket()[f.id])),
            criteria: computed(() => ({ from: store.from(), to: store.to() }))
        })),
        withCallState(),
        withMethods((
            store,
            flightService = inject(FlightService)
        ) => ({
    
            async load(): Promise<void> {
                const flights = await flightService.findPromise(store.from(), store.to());
                patchState(store, { flights });
            },
    
            updateCriteria(c: Criteria): void {
                patchState(store, { from: c.from, to: c.to });
            },
    
            updateBasket(flightId: number, selected: boolean): void {
                patchState(store, ({ basket }) => ({
                    basket: {
                        ...basket,
                        [flightId]: selected
                    }
                }));
            },
    
            delay(): void {
                patchState(store, ({ flights }) => ({
                    flights: [
                        {
                            ...flights[0],
                            date: addMinutes(flights[0].date, 15)
                        },
                        ...flights.slice(1)
                    ]
                }));
            },
    
            connectCriteria: rxMethod<Criteria>((c$) => c$.pipe(
                filter(c => c.from.length >= 3 && c.to.length >= 3),
                debounceTime(300),
                tap(() => patchState(store, setLoading())),
                switchMap(c => flightService.find(c.from, c.to)),
                // delay(7000),
                tap(flights => patchState(store, { flights } /*, setLoaded()*/)),
                tap(() => patchState(store, setLoaded())),
            )),
    
        })),
        withHooks({
            onInit(store): void {
    
                // store.load();
                store.connectCriteria(store.criteria);
    
            },
            onDestroy(store): void {
                console.log('Hasta la vista, Store', store);
            }
        })
    )
}