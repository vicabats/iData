import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CommonModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    NgxMaskDirective,
    FormsModule,
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor, Validator {
  constructor(private dateAdapter: DateAdapter<any>) {
    this.dateAdapter.setLocale('pt-BR');
  }

  private _value: string | number = '';

  get value(): string | number {
    return this._value;
  }

  @Input()
  set value(val: string | number) {
    this._value = val;
    this.onChange(val);
  }
  @Input() label!: string;
  @Input() errorMessage: string = 'Campo obrigatório';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.valid
      ? null
      : { invalidForm: { valid: false, message: 'Invalid form' } };
  }

  get showError(): boolean {
    return this.errorMessage !== '' && this.errorMessage.length > 0;
  }
}
