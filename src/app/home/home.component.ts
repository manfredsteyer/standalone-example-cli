import { Component, inject } from "@angular/core";
import { LoggerService } from "../shared/logger/logger";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  logger = inject(LoggerService);

  constructor() {
    this.logger.debug('home', 'My Debug Message');    
    this.logger.info('home', 'My Info Message');    
    this.logger.error('home', 'My Error Message');   
  }
}
