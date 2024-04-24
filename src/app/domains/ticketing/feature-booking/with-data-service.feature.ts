import { computed, inject } from "@angular/core";
import { patchState, signalStoreFeature, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { filter, debounceTime, tap, switchMap, delay } from "rxjs";
import { Flight, FlightService } from "../data";
import { withCallState } from "./call-state.feature";
import { Criteria } from "./criteria";

export function withDataService() {
    return signalStoreFeature(
        withCallState(),
        withState({
            from: 'Paris',
            to: 'Hamburg',
            flights: [] as Flight[],
            basket: {} as Record<number, boolean> 
        }),
        withComputed((store) => ({
            selected: computed(() => store.flights().filter(f => store.basket()[f.id])),
            criteria: computed(() => ({from: store.from(), to: store.to()}))
        })),
        withMethods((
            store,
            flightService = inject(FlightService)
        ) => ({
    
            updateCriteria(criteria: Criteria): void {
                patchState(store, criteria);
            },
    
            load(): void {
                patchState(store, { callState: 'loading' });
    
                flightService.find(store.from(), store.to()).subscribe({
                    next: (flights) => {
                        patchState(store, { flights });
                        patchState(store, { callState: 'loaded' });
    
                    },
                    error: (error) => {
                        console.error('error', error);
                        patchState(store, { callState: { error }});
                    }
                });
            },
    
            updateBasket(id: number, selected: boolean): void {
                patchState(store, (state) => ({
                    basket: {
                        ...state.basket,
                        [id]: selected
                    }
                }));
            },
    
            loadByCriteria: rxMethod<Criteria>(c$ => c$.pipe(
                filter(c => c.from.length >= 3 && c.to.length >= 3),
                debounceTime(300),
                tap(() => {
                    patchState(store, { callState: 'loading' });
                }),
                switchMap(c => flightService.find(c.from, c.to)),
                // TODO: Error Handling
                tap(flights => {
                    patchState(store, { flights });
                    patchState(store, { callState: 'loaded' });
                }),
            )),
    
        })),
        withHooks({
            onInit(store) {
                const criteria = store.criteria;
                store.loadByCriteria(criteria);
            }
        })
    )
}