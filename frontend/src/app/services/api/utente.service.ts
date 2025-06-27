// src/app/services/utente.service.ts
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class UtenteService extends BaseApiService<any> {
  constructor() {
    super('utenti');
  }

  getById(id: number) {
    return this.getBy(id);
  }
}
