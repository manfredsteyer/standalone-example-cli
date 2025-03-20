import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { LoggerService } from "../shared/logger/logger";

@Component({
    selector: 'flight-booking',
    imports: [
        RouterOutlet,
        RouterLink,
    ],
    templateUrl: './flight-booking.component.html'
})
export class FlightBookingComponent {
  logger = inject(LoggerService);

  constructor() {
    this.logger.info('booking', 'Hello from Booking');
  }
  
}
