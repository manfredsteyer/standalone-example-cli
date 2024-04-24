import { signalStore } from "@ngrx/signals";
import { withDataService } from "./with-data-service.feature";

export const FlightBookingStore = signalStore(
    { providedIn: 'root' },
    withDataService(),
);