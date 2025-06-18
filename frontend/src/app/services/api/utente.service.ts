// src/app/services/utente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class UtenteService extends BaseApiService<any> {
  constructor() {
    super('utenti'); // punto al mock json-server: /utenti
  }

  getById(id: number) {
    return this.getBy(id);
  }
}
