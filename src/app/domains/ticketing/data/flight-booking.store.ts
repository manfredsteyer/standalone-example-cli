import { FlightFilter, FlightService } from './flight.service';
import { Flight } from './flight';
import { withDataService } from 'src/app/shared/util-common';
import {
  signalStore,
} from '@ngrx/signals';

import { withEntities } from '@ngrx/signals/entities';
import { withCallState } from 'src/app/shared/util-common';
import { withUndoRedo } from 'src/app/shared/undo-redo.feature';


const initFilter: FlightFilter = { 
  from: 'Graz', 
  to: 'Hamburg' 
}

export const FlightBookingStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withEntities<Flight>(),
  withDataService(FlightService, initFilter),
  withUndoRedo(),
);