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
    collection: 'flight'
  }),
  withEntities({ 
    entity: type<Flight>(), 
    collection: 'flight'
  }),
  withDataService({
    dataServiceType: FlightService, 
    filter: { from: 'Graz', to: 'Hamburg' },
    collection: 'flight'
  }),
  withUndoRedo({
    collections: ['flight'],
  }),
);


//
// For the sake of demonstration:
// The same store but without configured properties
//
export const SimpleFlightBookingStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withEntities<Flight>(),
  withDataService({
    dataServiceType: FlightService, 
    filter: { from: 'Graz', to: 'Hamburg' },
  }),
  withUndoRedo(),
);