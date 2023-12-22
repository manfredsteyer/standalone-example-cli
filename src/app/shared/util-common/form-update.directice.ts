import { Directive, EventEmitter, Output, inject } from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({ selector: 'form[appUpdate]', standalone: true })
export class FormUpdateDirective {
  private ngForm = inject(NgForm);

  @Output()
  appUpdate = new EventEmitter();

  constructor() {
    this.ngForm.valueChanges?.subscribe((value) => this.appUpdate.emit(value));
  }
}