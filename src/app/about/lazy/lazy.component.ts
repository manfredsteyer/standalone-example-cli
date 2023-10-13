import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: 'app-lazy',
  imports: [CommonModule],
  template: `<h2><a (click)="counter = counter +1">Counter: {{ counter }}</a></h2>`
})
export class LazyComponent {
  counter = 0;
}
