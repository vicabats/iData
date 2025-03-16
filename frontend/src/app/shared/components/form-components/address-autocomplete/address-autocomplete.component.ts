import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import { InputComponent } from '../input/input.component';
import { LocationService } from '../../../services/location.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/// <reference types="@types/google.maps" />

@Component({
  selector: 'app-address-autocomplete',
  imports: [InputComponent],
  templateUrl: './address-autocomplete.component.html',
  styleUrl: './address-autocomplete.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressAutocompleteComponent),
      multi: true,
    },
  ],
})
export class AddressAutocompleteComponent
  implements AfterViewInit, ControlValueAccessor
{
  @ViewChild('addressInput') addressField!: InputComponent;

  @ViewChild('search')
  public searchElementRef: ElementRef | undefined;

  @Input() errorMessage: string = 'Campo obrigatório';

  autocomplete: google.maps.places.Autocomplete | undefined;

  private _value: any;
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private location: LocationService) {}

  ngAfterViewInit(): void {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.addressField?.value
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      console.log(place);
    });

    const autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef?.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      const place: google.maps.places.PlaceResult = autocomplete.getPlace();

      console.log('place:', place);
    });
    // this.location.initializeAutocomplete(this.address).subscribe(
    //   (address: string) => {
    //     console.log('Endereço selecionado:', address);
    //     this._value = address;
    //     this.onChange(address);
    //     this.onTouched();
    //   },
    //   (error: any) => {
    //     console.error('Erro ao selecionar endereço:', error);
    //   }
    // );
  }

  writeValue(value: any): void {
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
