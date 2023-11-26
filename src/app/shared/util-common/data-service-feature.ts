import { Type, computed, inject } from "@angular/core";
import { patchState, signalStoreFeature, type, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { CallState, setLoaded, setLoading } from "./call-state.feature";
import { setAllEntities, EntityId } from "@ngrx/signals/entities";

export interface DataService<E extends { id: EntityId }, F> {
    load(filter: F): Promise<E[]>;
}

export function withDataService<E extends { id: EntityId }, F, S extends DataService<E, F>>(dataServiceType: Type<S>, filter: F) {

    return signalStoreFeature
    (
        {
            state: type<{ 
                callState: CallState, 
                entityMap: Record<EntityId, E>, 
                ids: EntityId[]
            }>()
        },
        withState({
            filter,
            currentId: null as EntityId | null
        }),
        withComputed(({ currentId, entityMap }) => ({
            currentEntity: computed(() => {
                const id = currentId();
                if (!id) { 
                    return null;
                }
                return entityMap()[id];
            })
        })),
        withMethods((store, dataService = inject(dataServiceType)) => ({
            updateFilter(filter: F): void {
                patchState(store, { filter });
            },
            select(id: EntityId | null): void {
                patchState(store, { currentId: id})
            },
            async load(): Promise<void> {
                patchState(store, setLoading());
                const result = await dataService.load(store.filter());
                patchState(store, setAllEntities(result));
                patchState(store, setLoaded());
            }
        })),
        withHooks({
            onInit(store) {
                console.log('init', store.filter());
            }
        })
    );
}