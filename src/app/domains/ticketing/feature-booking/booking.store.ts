import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { Flight, FlightService } from "../data";
import { computed, inject } from "@angular/core";
import { Criteria } from "./criteria";
import { addMinutes } from "src/app/shared/util-common";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, filter, switchMap, tap } from "rxjs";

export const BookingStore = signalStore(
    { providedIn: 'root' },
    withState({
        from: 'Hamburg',
        to: 'London',
        flights: [] as Flight[],
        basket: {} as Record<number, boolean>
    }),
    withComputed((store) => ({
        selected: computed(() => store.flights().filter(f => store.basket()[f.id])),
        criteria: computed(() => ({ from: store.from(), to: store.to() }))
    })),
    withMethods((
        store,
        flightService = inject(FlightService)
    ) => ({
        async load(): Promise<void> {
            const flights = await flightService.findPromise(store.from(), store.to());
            patchState(store, { flights });
        },
        updateCriteria(c: Criteria): void {
            patchState(store, c);
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
        connectFilter: rxMethod<Criteria>(c$ => c$.pipe(
            filter(c => c.from.length >= 3 && c.to.length >= 3),
            debounceTime(300),
            switchMap(c => flightService.find(c.from, c.to)),
            tap(flights => {
                patchState(store, { flights });
            })
        ))
    })),
    withHooks({
        onInit(store) {
            const filter = store.criteria;
            store.connectFilter(filter);
        },
        onDestroy(store) {
            console.log('Hasta la vista, Store!', store)
        }
    })
)