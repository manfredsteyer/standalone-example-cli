import { FlightService } from './flight.service';
import { Flight } from './flight';
import { withDataService } from 'src/app/shared/util-common';
import {
  signalStore, type,
} from '@ngrx/signals';

import { withEntities } from '@ngrx/signals/entities';
import { withCallState } from 'src/app/shared/util-common';

export const FlightBookingStore = signalStore(
  { providedIn: 'root' },
  withCallState(),
  withEntities({ entity: type<Flight>(), collection: 'flight'}),
  withDataService({
    dataServiceType: FlightService, 
    filter: { from: 'Graz', to: 'Hamburg'},
    prefix: 'flight'
  }),
  // withUndoRedo(),
);