import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/// <reference types="@types/googlemaps" />

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private selectedPlace: string | undefined;

  constructor() {}

  public initializeAutocomplete(input: ElementRef): Observable<string> {
    return new Observable((observer) => {
      const autocomplete = new google.maps.places.Autocomplete(
        input.nativeElement,
        {
          types: ['address'],
          componentRestrictions: { country: 'BR' },
        }
      );

      autocomplete.addListener('place_changed', () => {
        const place: google.maps.places.PlaceResult = autocomplete.getPlace();
        if (place.formatted_address) {
          observer.next(place.formatted_address);
        } else {
          observer.error('No address available');
        }
      });
    });
  }
}
