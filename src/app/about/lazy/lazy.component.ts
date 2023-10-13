import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: 'app-lazy',
  imports: [CommonModule],
  template: `@if (visible) {<h2>{{ title }}</h2>}`
})
export class LazyComponent {
  title = 'Standalone Demo';
  visible = true;
}
