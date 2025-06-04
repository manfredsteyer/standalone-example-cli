import {Component} from '@angular/core';

// eslint-disable-next-line @softarc/sheriff/dependency-rule
import {TicketsModule} from '../feature-my-tickets';

@Component({
    selector: 'app-next-flight',
    template: `
    <app-my-tickets [limit]="1" title="Next Flight"></app-my-tickets>
  `,
    imports: [
        TicketsModule
    ]
})
export class NextFlightComponent  {
}

export default NextFlightComponent;
