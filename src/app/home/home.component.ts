import { Component, inject } from "@angular/core";
import { LoggerService } from "../shared/logger/logger";
import { AuthService } from "../shared/auth.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true
})
export class HomeComponent {
  logger = inject(LoggerService);
  auth = inject(AuthService);

  constructor() {
    this.logger.debug('home', 'My Debug Message');    
    this.logger.info('home', 'My Info Message');    
    this.logger.error('home', 'My Error Message');   
  }
}
