import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
    selector: 'input[appCity]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: CityValidator,
            multi: true
        }
    ],
    standalone: false
})
export class CityValidator implements Validator {

  public validate(c: AbstractControl): ValidationErrors {

    if (c.value === 'Graz'
      || c.value === 'Hamburg'
      || c.value === 'Frankfurt'
      || c.value === 'Wien'
      || c.value === 'Mallorca') {

      return {};
    }

    return {
      appCity: true
    };
  }
}
