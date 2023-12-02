import { Signal, Type, computed, inject } from "@angular/core";
import { SignalStoreFeature, patchState, signalStoreFeature, type, withComputed, withMethods, withState } from "@ngrx/signals";
import { CallState, setLoaded, setLoading } from "./call-state.feature";
import { setAllEntities, EntityId, NamedEntityState } from "@ngrx/signals/entities";
import { EntitySignals, EntityState, NamedEntitySignals } from "@ngrx/signals/entities/src/models";

export type Filter = Record<string, unknown>;
export type Entity = { id: EntityId };

export interface DataService<E extends Entity, F extends Filter> {
    load(filter: F): Promise<E[]>;
}


function capitalize(str: string): string {
    if (!str) {
        return str;
    }

    return str[0].toUpperCase() + str.substring(1);
}

export function getDataServiceKeys(prefix = '') {
    
    if (prefix) {
        return {
            filterKey: `${prefix}Filter`,
            selectedIdsKey: `${prefix}SelectedIds`,
            selectedEntitiesKey: `${prefix}SelectedEntities`,
            updateFilterKey: `update${capitalize(prefix)}Filter`,
            updateSelectedKey: `updateSelected${capitalize(prefix)}`,
            loadKey: `load${capitalize(prefix)}`,

            entitiesKey: `${prefix}Entities`,
            entityMapKey: `${prefix}EntityMap`,
            idsKey: `${prefix}Ids`,
        };
    
    }
    
    return {
        filterKey: `filter`,
        selectedIdsKey: `selectedIds`,
        selectedEntitiesKey: `selectedEntities`,
        updateFilterKey: `updateFilter`,
        updateSelectedKey: `updateSelected`,
        loadKey: `load`,

        entitiesKey: `entities`,
        entityMapKey: `entityMap`,
        idsKey: `ids`,
    };

}

export type NamedDataServiceState<Prop extends string, F extends Filter> = {
    [K in Prop as `${K}Filter`]: F;
} & {
    [K in Prop as `${K}SelectedIds`]: Record<EntityId, boolean>;
}

export type DataServiceState<F extends Filter> = {
    filter: F;
    selectedIds: Record<EntityId, boolean>;
}

export type NamedDataServiceSignals<Prop extends string, E extends Entity> = 
{
    [K in Prop as `${K}SelectedEntities`]: Signal<E[]>;
}

export type DataServiceSignals<E extends Entity> = 
{
    selectedEntities: Signal<E[]>;
}


export type NamedDataServiceMethods<Prop extends string, F extends Filter> = 
{
    [K in Prop as `update${Capitalize<K>}Filter`]: (filter: F) => void;
} &
{
    [K in Prop as `updateSelected${Capitalize<K>}`]: (id: EntityId, selected: boolean) => void;
} &
{
    [K in Prop as `load${Capitalize<K>}`]: () => void;
}


export type DataServiceMethods<F extends Filter> = 
{
    updateFilter: (filter: F) => void;
    updateSelection: (id: EntityId, selected: boolean) => void;
    load: () => void;
}

// updateFilter(filter: F): void;
// updateSelected(id: EntityId, selected: boolean): void;
// load(): Promise<void>;



export function withDataService<E extends Entity, F extends Filter, S extends DataService<E, F>, Prop extends string>(options: {dataServiceType: Type<S>, filter: F, prefix: Prop}): SignalStoreFeature<
    {
        state: { callState: CallState } & NamedEntityState<E, Prop>
        signals: NamedEntitySignals<E, Prop>,
        methods: {},
    },
    {
        state: NamedDataServiceState<Prop, F>
        signals: NamedDataServiceSignals<Prop, E>
        methods: NamedDataServiceMethods<Prop, F>
    }>;

export function withDataService<E extends Entity, F extends Filter, S extends DataService<E, F>>(options: {dataServiceType: Type<S>, filter: F}): SignalStoreFeature<
    {
        state: { callState: CallState } & EntityState<E>
        signals: EntitySignals<E>,
        methods: {},
    },
    {
        state: DataServiceState<F>
        signals: DataServiceSignals<E>
        methods: DataServiceMethods<F>
    }>;

export function withDataService<E extends Entity, F extends Filter, S extends DataService<E, F>>(options: {dataServiceType: Type<S>, filter: F, prefix?: string}): SignalStoreFeature {
    
    const { dataServiceType, filter, prefix } = options;
    const keys = getDataServiceKeys(prefix);

    return signalStoreFeature(

        withState({
            [keys.filterKey]: filter,
            [keys.selectedIdsKey]: {} as Record<EntityId, boolean>,
        }),
        withComputed((store: Record<string, unknown>) => {
            const entities = store[keys.entitiesKey] as Signal<E[]>;
            const selectedIds = store[keys.selectedIdsKey] as Signal<Record<EntityId, boolean>>;

            return {
                selectedEntities: computed(() => entities().filter(e => selectedIds()[e.id]))
            }
        }),
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