import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  styles: [
    `
      .box {
        font-size: 16px;
        padding: 20px;
        border: 2px gray solid;
        display: inline-block;
      }

      BUTTON {
        border-radius: 100%;
        border: 0px;
        height: 35px;
        width: 35px;
        background-color: #ffeecc;
      }

      A {
        cursor: pointer;
      }

      .count {
        width: 100px;
        display: inline-block;
        text-align: center;
      }

      .price {
        margin-top: 20px;
      }
    `,
  ],
  template: `<div class="box">
    <div>
      <button (click)="count = count - 1">➖</button>
      <span class="count">{{ count }} Flights</span>
      <button (click)="count = count + 1">➕</button>
    </div>
    <div class="price">€ {{ count * 350 }}</div>
  </div>`,
  standalone: true,
})
export class LazyComponent {
  count = 1;
}
