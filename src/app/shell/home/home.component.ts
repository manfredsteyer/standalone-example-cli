import { Component, inject } from "@angular/core";
import { LogService } from "../../shared/util-logger";

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  logger = inject(LogService);

  constructor() {
    this.logger.debug('home', 'My Debug Message');    
    this.logger.info('home', 'My Info Message');    
    this.logger.error('home', 'My Error Message');   
  }
}
