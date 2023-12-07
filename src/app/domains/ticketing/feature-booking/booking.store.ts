import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { Flight, FlightService } from "../data";
import { computed, effect, inject } from "@angular/core";
import { Criteria } from "./criteria";
import { addMinutes } from "src/app/shared/util-common";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';

import { debounceTime, filter, switchMap, tap } from "rxjs";

export const BookingStore = signalStore(
    { providedIn: 'root' },
    withEntities<Flight>(),
    withState({
        from: 'Hamburg',
        to: 'London',
        basket: {} as Record<number, boolean>
    }),
    withComputed((store) => ({
        selected: computed(() => store.entities().filter(f => store.basket()[f.id])),
        criteria: computed(() => ({ from: store.from(), to: store.to() }))
    })),
    withMethods((
        store,
        flightService = inject(FlightService)
    ) => ({
        async load(): Promise<void> {
            const flights = await flightService.findPromise(store.from(), store.to());
            patchState(store, setAllEntities(flights));
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
            const flights = store.entities();
            patchState(store, setAllEntities([
                {
                    ...flights[0],
                    date: addMinutes(flights[0].date, 15)
                },
                ...flights.slice(1)
            ]));
        },
        connectCriteria: rxMethod<Criteria>(c$ => c$.pipe(
            filter(c => c.from.length >= 3 && c.to.length >= 3),
            debounceTime(300),
            switchMap(c => flightService.find(c.from, c.to)),
            tap(flights => patchState(store, setAllEntities(flights)))
        ))
    })),
    withHooks({
        onInit(store) {
            // store.load();
            store.connectCriteria(store.criteria);

            effect(() => {
                console.log('entities', store.entities());
                console.log('entityMap', store.entityMap());
                console.log('ids', store.ids());
            })
        },
        onDestroy(store) {
            console.log('Hasta la vista, Store!', store)
        }
    })
)