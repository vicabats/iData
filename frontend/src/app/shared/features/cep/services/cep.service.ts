import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CepAddressModel } from '../models/cep_address_model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CepService {
  readonly BASE_URL = 'https://viacep.com.br/ws';

  constructor(private readonly httpClient: HttpClient) {}

  getAddress(cep: string): Observable<CepAddressModel> {
    return this.httpClient.get(`${this.BASE_URL}/${cep}/json`).pipe(
      map((response: any) => {
        return {
          cep: response.cep,
          logradouro: response.logradouro,
          complemento: response.complemento,
          bairro: response.bairro,
          localidade: response.localidade,
          uf: response.uf,
          estado: response.estado,
          unidade: response.unidade,
        };
      })
    );
  }
}
