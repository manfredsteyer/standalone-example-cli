import { signalStore } from "@ngrx/signals";
import { withSimpleDataService } from "./with-simple-data-service";

export const BookingStore = signalStore(
    { providedIn: 'root' },
    withSimpleDataService()
)