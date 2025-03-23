import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function getNameRegexValidator(): Validators {
  return Validators.pattern(/^((?:[^\s]+(?:\s+|$)){2,})$/);
}

export function getBirthdateRegexValidator(): Validators {
  return Validators.pattern(
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
  );
}

export function getCPFRegexValidator(): Validators {
  return Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
}

export function getPhoneRegexValidator(): Validators {
  return Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/);
}

export function getZipCodeRegexValidator(): Validators {
  return Validators.pattern(/^\d{5}-\d{3}$/);
}

export function getPasswordMinLenghtValidator(): Validators {
  return Validators.minLength(6);
}

export function getPasswordRegexValidator(): Validators {
  return Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/);
}

export function passwordMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
