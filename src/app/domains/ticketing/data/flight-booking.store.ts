import { FlightFilter, FlightService } from './flight.service';
import { Flight } from './flight';
import { withDataService } from 'src/app/shared/util-common';
import {
  signalStore,
} from '@ngrx/signals';

import { withEntities } from '@ngrx/signals/entities';
import { withCallState } from 'src/app/shared/util-common';
import { withUndoRedo } from 'src/app/shared/undo-redo.feature';

export const FlightBookingStore = signalStore(
  { providedIn: 'root' },
  withEntities<Flight>(),
  withCallState(),
  withDataService(FlightService, { from: 'Graz', to: 'Hamburg'} ),
  withUndoRedo(),
);