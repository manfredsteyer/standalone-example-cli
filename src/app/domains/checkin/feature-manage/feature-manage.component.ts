import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckinService } from '../data';

import { FlightService } from '../../ticketing/data';
import { LoggerService} from '../../../shared/util-logger';

@Component({
  selector: 'app-feature-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-manage.component.html',
  styleUrls: ['./feature-manage.component.css'],
})
export class FeatureManageComponent {
  service = inject(CheckinService);
  flightService = inject(FlightService);
  logger = inject(LoggerService);
  
  ticketNumber = '';

  checkin() {
    this.service.checkin(this.ticketNumber);
  }
}

// TEST 123 456
