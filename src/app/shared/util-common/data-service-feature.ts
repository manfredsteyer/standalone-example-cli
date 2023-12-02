import { Signal, Type, computed, inject } from "@angular/core";
import { SignalStoreFeature, patchState, signalStoreFeature, type, withComputed, withMethods, withState } from "@ngrx/signals";
import { CallState, setLoaded, setLoading } from "./call-state.feature";
import { setAllEntities, EntityId } from "@ngrx/signals/entities";
import { EntityState, NamedEntitySignals } from "@ngrx/signals/entities/src/models";
import { SignalStateMeta } from "@ngrx/signals/src/signal-state";

export type Filter = Record<string, unknown>;
export type Entity = { id: EntityId };

export interface DataService<E extends Entity, F extends Filter> {
    load(filter: F): Promise<E[]>;
}

export function capitalize(str: string): string {
    return str ? str[0].toUpperCase() + str.substring(1) : str;
}

export function getDataServiceKeys(options: { prefix?: string }) {
    const filterKey = options.prefix ? `${options.prefix}Filter` : 'filter';
    const selectedIdsKey = options.prefix ? `selected${capitalize(options.prefix)}Ids` : 'selectedIds';
    const selectedEntitiesKey = options.prefix ? `selected${capitalize(options.prefix)}Entities` : 'selectedEntities';

    const updateFilterKey = options.prefix ? `update${capitalize(options.prefix)}Filter` : 'updateFilter';
    const updateSelectedKey = options.prefix ? `updateSelected${capitalize(options.prefix)}Entities` : 'updateSelected';
    const loadKey = options.prefix ? `load${capitalize(options.prefix)}Entities` : 'load';

    // TODO: Take these from @ngrx/signals/entities, when they are exported
    const entitiesKey = options.prefix ? `${options.prefix}Entities` : 'entities';
    const entityMapKey = options.prefix ? `${options.prefix}EntityMap` : 'entityMap';
    const idsKey = options.prefix ? `${options.prefix}Ids` : 'ids';

    return { filterKey, selectedIdsKey, selectedEntitiesKey, updateFilterKey, updateSelectedKey, loadKey, entitiesKey, entityMapKey, idsKey };
}

export type NamedDataServiceState<F extends Filter, Prop extends string> =
    {
        [K in Prop as `${K}Filter`]: F;
    } & {
        [K in Prop as `selected${Capitalize<K>}Ids`]: Record<EntityId, boolean>;
    }

export type DataServiceState<F extends Filter> = {
    filter: F;
    selectedIds: Record<EntityId, boolean>;
}

export type NamedDataServiceSignals<E extends Entity, Prop extends string> =
    {
        [K in Prop as `selected${Capitalize<K>}Entities`]: Signal<E[]>;
    }

export type DataServiceSignals<E extends Entity> =
    {
        selectedEntities: Signal<E[]>;
    }

export type NamedDataServiceMethods<F extends Filter, Prop extends string> =
    {
        [K in Prop as `update${Capitalize<K>}Filter`]: (filter: F) => void;
    } &
    {
        [K in Prop as `updateSelected${Capitalize<K>}Entities`]: (id: EntityId, selected: boolean) => void;
    } &
    {
        [K in Prop as `load${Capitalize<K>}Entities`]: () => Promise<void>;
    }

export type DataServiceMethods<F extends Filter> =
    {
        updateFilter: (filter: F) => void;
        updateSelected: (id: EntityId, selected: boolean) => void;
        load: () => Promise<void>;
    }

export function withDataService<E extends Entity, F extends Filter, S extends DataService<E, F>, Prop extends string>(options: { dataServiceType: Type<S>, filter: F, prefix: Prop }): SignalStoreFeature<
    {
        state: { callState: CallState },
        // These alternatives break type inference: 
        // state: { callState: CallState } & NamedEntityState<E, Prop>,
        // state: NamedEntityState<E, Prop>,

        signals: NamedEntitySignals<E, Prop>,
        methods: {},
    },
    {
        state: NamedDataServiceState<F, Prop>
        signals: NamedDataServiceSignals<E, Prop>
        methods: NamedDataServiceMethods<F, Prop>
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

export function withDataService<E extends Entity, F extends Filter, S extends DataService<E, F>, Prop extends string>(options: { dataServiceType: Type<S>, filter: F, prefix?: Prop }): SignalStoreFeature<any, any>
{
    const { dataServiceType, filter, prefix } = options;
    const { entitiesKey, filterKey, loadKey, selectedEntitiesKey, selectedIdsKey, updateFilterKey, updateSelectedKey } = getDataServiceKeys(options);

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
        withMethods((store: Record<string, unknown> & SignalStateMeta<object>) => {

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
                    patchState(store, setLoading());
                    const result = await dataService.load(filter());
                    if (prefix) {
                        patchState(store, setAllEntities(result, { collection: prefix }));
                    }
                    else {
                        patchState(store, setAllEntities(result));
                    }
                    patchState(store, setLoaded());
                }
            };
        })
    );
}