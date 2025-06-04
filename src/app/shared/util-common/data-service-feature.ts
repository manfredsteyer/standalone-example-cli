import { Signal, Type, computed, inject } from "@angular/core";
import { patchState, signalStoreFeature, type, withComputed, withMethods, withState } from "@ngrx/signals";
import { CallState, setLoaded, setLoading } from "./call-state.feature";
import { setAllEntities, EntityId } from "@ngrx/signals/entities";

export type Filter = Record<string, unknown>;
export type Entity = { id: EntityId };

export interface DataService<E extends Entity, F extends Filter> {
    load(filter: F): Promise<E[]>;
}

export function withDataService<E extends Entity, F extends Filter, S extends DataService<E, F>>(dataServiceType: Type<S>, filter: F) {
    return signalStoreFeature(
        // First parameter contains 
        // Our expectations to the store:
        // If they are not fulfilled, TypeScript
        // will prevent adding this feature!
        {
            state: type<{
                callState: CallState,
                entityMap: Record<EntityId, E>,
                ids: EntityId[]
            }>(),
            props: type<{
                entities: Signal<Entity[]>
            }>(),
            methods: type<{}>()
        },
        withState({
            filter,
            selectedIds: {} as Record<EntityId, boolean>,
        }),
        withComputed(({ selectedIds, entities }) => ({
            selectedEntities: computed(() => entities().filter(e => selectedIds()[e.id]))
        })),
        withMethods((store) => {
            const dataService = inject(dataServiceType)
            return {
                updateFilter(filter: F): void {
                    patchState(store, { filter });
                },
                updateSelected(id: EntityId, selected: boolean): void {
                    patchState(store, ({ selectedIds }) => ({
                        selectedIds: {
                            ...selectedIds,
                            [id]: selected,
                        }
                    }));
                },
                async load(): Promise<void> {
                    patchState(store, setLoading());
                    const result = await dataService.load(store.filter());
                    patchState(store, setAllEntities(result));
                    patchState(store, setLoaded());
                }
            };
        })
    );
}
