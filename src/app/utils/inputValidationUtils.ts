import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";



export function allOnlyNumber(event: KeyboardEvent): void {
    const isNumeric = /[0-9]/.test(event.key);
    const isControlKey = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ].includes(event.key);
    if (!isNumeric && !isControlKey) {
      event.preventDefault();
    }
  }

  export function phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phoneNumberCodePattern = /^[0-9]{10,10}$/;
      const isValid = phoneNumberCodePattern.test(control.value);
      return isValid ? null : { invalid: true };
    };
  }

//   export function NumberValidator(form:number,to:number): ValidatorFn {
//     return (control: AbstractControl): ValidationErrors | null => {
//       const NumberCodePattern = /^[0-9]{${from},${to}}$/;
//       const isValid = NumberCodePattern.test(control.value);
//       return isValid ? null : { invalid: true };
//     };
//   }
  
  export function validator(pattern: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = pattern.test(control.value);
      return isValid ? null : { invalid: true };
    };
  }

