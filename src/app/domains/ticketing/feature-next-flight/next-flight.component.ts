import { Component, OnInit } from '@angular/core';
import { TicketsModule } from '../feature-my-tickets';

@Component({
  selector: 'app-next-flight',
  standalone: true,
  template: `
    <app-my-tickets [limit]="1" title="Next Flight"></app-my-tickets>
  `,
  imports: [
    TicketsModule
  ]
})
export class NextFlightComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

export default NextFlightComponent;