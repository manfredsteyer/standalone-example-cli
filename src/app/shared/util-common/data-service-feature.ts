import { Signal, Type, computed, inject } from "@angular/core";
import { SignalStoreFeature, patchState, signalStoreFeature, type, withComputed, withMethods, withState } from "@ngrx/signals";
import { CallState, getCallStateKeys, setLoaded, setLoading } from "./call-state.feature";
import { setAllEntities, EntityId } from "@ngrx/signals/entities";
import { EntityState, NamedEntitySignals } from "@ngrx/signals/entities/src/models";
import { StateSignal } from "@ngrx/signals/src/state-signal";

export type Filter = Record<string, unknown>;
export type Entity = { id: EntityId };

export interface DataService<E extends Entity, F extends Filter> {
    load(filter: F): Promise<E[]>;
}

export function capitalize(str: string): string {
    return str ? str[0].toUpperCase() + str.substring(1) : str;
}

export function getDataServiceKeys(options: { collection?: string }) {
    const filterKey = options.collection ? `${options.collection}Filter` : 'filter';
    const selectedIdsKey = options.collection ? `selected${capitalize(options.collection)}Ids` : 'selectedIds';
    const selectedEntitiesKey = options.collection ? `selected${capitalize(options.collection)}Entities` : 'selectedEntities';

    const updateFilterKey = options.collection ? `update${capitalize(options.collection)}Filter` : 'updateFilter';
    const updateSelectedKey = options.collection ? `updateSelected${capitalize(options.collection)}Entities` : 'updateSelected';
    const loadKey = options.collection ? `load${capitalize(options.collection)}Entities` : 'load';

    // TODO: Take these from @ngrx/signals/entities, when they are exported
    const entitiesKey = options.collection ? `${options.collection}Entities` : 'entities';
    const entityMapKey = options.collection ? `${options.collection}EntityMap` : 'entityMap';
    const idsKey = options.collection ? `${options.collection}Ids` : 'ids';

    return { filterKey, selectedIdsKey, selectedEntitiesKey, updateFilterKey, updateSelectedKey, loadKey, entitiesKey, entityMapKey, idsKey };
}

export type NamedDataServiceState<F extends Filter, Collection extends string> =
    {
        [K in Collection as `${K}Filter`]: F;
    } & {
        [K in Collection as `selected${Capitalize<K>}Ids`]: Record<EntityId, boolean>;
    }

export type DataServiceState<F extends Filter> = {
    filter: F;
    selectedIds: Record<EntityId, boolean>;
}

export type NamedDataServiceSignals<E extends Entity, Collection extends string> =
    {
        [K in Collection as `selected${Capitalize<K>}Entities`]: Signal<E[]>;
    }

export type DataServiceSignals<E extends Entity> =
    {
        selectedEntities: Signal<E[]>;
    }

export type NamedDataServiceMethods<F extends Filter, Collection extends string> =
    {
        [K in Collection as `update${Capitalize<K>}Filter`]: (filter: F) => void;
    } &
    {
        [K in Collection as `updateSelected${Capitalize<K>}Entities`]: (id: EntityId, selected: boolean) => void;
    } &
    {
        [K in Collection as `load${Capitalize<K>}Entities`]: () => Promise<void>;
    }

export type DataServiceMethods<F extends Filter> =
    {
        updateFilter: (filter: F) => void;
        updateSelected: (id: EntityId, selected: boolean) => void;
        load: () => Promise<void>;
    }

export function withDataService<E extends Entity, F extends Filter, S extends DataService<E, F>, Collection extends string>(options: { dataServiceType: Type<S>, filter: F, collection: Collection }): SignalStoreFeature<
    {
        state: {},
        // These alternatives break type inference: 
        // state: { callState: CallState } & NamedEntityState<E, Collection>,
        // state: NamedEntityState<E, Collection>,

        signals: NamedEntitySignals<E, Collection>,
        methods: {},
    },
    {
        state: NamedDataServiceState<F, Collection>
        signals: NamedDataServiceSignals<E, Collection>
        methods: NamedDataServiceMethods<F, Collection>
    }
>;
export function withDataService<E extends Entity, F extends Filter, S extends DataService<E, F>>(options: { dataServiceType: Type<S>, filter: F }): SignalStoreFeature<
    {
        state: { callState: CallState } & EntityState<E>
        signals: {},
        methods: {},
    },
    {
        state: DataServiceState<F>
        signals: DataServiceSignals<E>
        methods: DataServiceMethods<F>
    }>;

export function withDataService<E extends Entity, F extends Filter, S extends DataService<E, F>, Collection extends string>(options: { dataServiceType: Type<S>, filter: F, collection?: Collection }): SignalStoreFeature<any, any>
{
    const { dataServiceType, filter, collection: prefix } = options;
    const { entitiesKey, filterKey, loadKey, selectedEntitiesKey, selectedIdsKey, updateFilterKey, updateSelectedKey } = getDataServiceKeys(options);
    const { callStateKey } = getCallStateKeys({collection: prefix});

    return signalStoreFeature(
        withState(() => ({
            [filterKey]: filter,
            [selectedIdsKey]: {} as Record<EntityId, boolean>,
        })),
        withComputed((store: Record<string, unknown>) => {
            const entities = store[entitiesKey] as Signal<E[]>;
            const selectedIds = store[selectedIdsKey] as Signal<Record<EntityId, boolean>>;

            return {
                [selectedEntitiesKey]: computed(() => entities().filter(e => selectedIds()[e.id]))
            }
        }),
        withMethods((store: Record<string, unknown> & StateSignal<object>) => {

            const dataService = inject(dataServiceType)
            return {
                [updateFilterKey]: (filter: F): void => {
                    patchState(store, { [filterKey]: filter });
                },
                [updateSelectedKey]: (id: EntityId, selected: boolean): void => {
                    patchState(store, (state: Record<string, unknown>) => ({
                        [selectedIdsKey]: {
                            ...state[selectedIdsKey] as Record<EntityId, boolean>,
                            [id]: selected,
                        }
                    }));
                },
                [loadKey]: async (): Promise<void> => {
                    const filter = store[filterKey] as Signal<F>;
                    if (prefix) {
                        store[callStateKey] && patchState(store, setLoading(prefix));
                        const result = await dataService.load(filter());
                        patchState(store, setAllEntities(result, { collection: prefix }));
                        store[callStateKey] &&  patchState(store, setLoaded(prefix));
                    }
                    else {
                        store[callStateKey] &&  patchState(store, setLoading());
                        const result = await dataService.load(filter());
                        patchState(store, setAllEntities(result));
                        store[callStateKey] &&  patchState(store, setLoaded());
                    }
                }
            };
        })
    );
}