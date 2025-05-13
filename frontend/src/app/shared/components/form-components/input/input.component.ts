import {
  Component,
  Input,
  forwardRef,
  ChangeDetectorRef,
  AfterViewChecked,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() errorMessage: string = '';
  @Input() mask?: string;

  @ViewChild(NgxMaskDirective) maskDirective?: NgxMaskDirective;

  private _value: string | number = '';
  disabled = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get value(): string | number {
    return this._value;
  }

  set value(val: string | number) {
    this._value = val || '';
    this.cdr.markForCheck();
  }
  writeValue(value: any): void {
    this.value = value || '';
    if (this.maskDirective) {
      this.maskDirective.writeValue(this.value);
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
    this.cdr.markForCheck();
  }

  markAsTouched(): void {
    this.onTouched();
    this.cdr.markForCheck();
  }

  get showError(): boolean {
    return this.errorMessage !== '' && this.errorMessage.length > 0;
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}
