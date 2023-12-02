import { FlightService } from './flight.service';
import { Flight } from './flight';
import { withDataService } from 'src/app/shared/util-common';
import { withUndoRedo } from 'src/app/shared/undo-redo.feature';

import {
  signalStore, type,
} from '@ngrx/signals';

import { withEntities } from '@ngrx/signals/entities';
import { withCallState } from 'src/app/shared/util-common';

export const FlightBookingStore = signalStore(
  { providedIn: 'root' },
  withCallState({
    prop: 'flight'
  }),
  withEntities({ entity: type<Flight>(), collection: 'flight'}),
  withDataService({
    dataServiceType: FlightService, 
    filter: { from: 'Graz', to: 'Hamburg' },
    prefix: 'flight'
  }),
  withUndoRedo({
    collections: ['flight'],
    maxStackSize: 100,
  }),
);

export const SimpleFlightBookingStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withEntities<Flight>(),
  withDataService({
    dataServiceType: FlightService, 
    filter: { from: 'Graz', to: 'Hamburg' },
  }),
  withUndoRedo({
    maxStackSize: 100,
  }),
);