import { signalStore } from "@ngrx/signals";
import { withDataService } from "./with-data-service";

export const BookingStore = signalStore(
    { providedIn: 'root' },
    withDataService(),
)