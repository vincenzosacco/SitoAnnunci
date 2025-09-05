// src/app/services/annunci.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Annuncio } from '../components/home/Annuncio';

@Injectable({
  providedIn: 'root'
})
export class AnnunciService {
  private readonly baseRoot = 'http://localhost:8081';
  private readonly apiUrl = `${this.baseRoot}/api`;

  constructor(private http: HttpClient) {}

  getAnnunci(): Observable<Annuncio[]> {
    return this.http.get<any[]>(`${this.apiUrl}/data`).pipe(
      map(response => response.map(item => Annuncio.fromJSON(item)))
    );
  }

  rimuoviAnnuncio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  aggiornaPrezzo(id: number, prezzoNuovo: number): void {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('prezzoNuovo', prezzoNuovo.toString());

    this.http.post(`${this.baseRoot}/update`, null, { params, responseType: 'text' })
      .subscribe({
        next: response => console.log('Successo:', response),
        error: err => console.error('Errore:', err)
      });
  }

  // ❗ Modifica: ritorna Observable invece di fare subscribe
  aggiornaSpecData(id: number, column: string, valore: any): Observable<any> {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('column', column)
      .set('nuovoValore', valore == null ? '' : valore.toString());


    return this.http.post(`${this.baseRoot}/updateSpecData`, null, {
      params,
      responseType: 'text'
    });
  }

  getAnnuncioById(id: number): Observable<Annuncio> {
    return this.http.get<Annuncio>(`${this.baseRoot}/getById/${id}`)
      .pipe(map(item => Annuncio.fromJSON(item)));
  }

  createAnnuncio(body: any): Observable<any> {
    return this.http.post(`${this.baseRoot}/create`, body);
  }

  getFotoAnnuncio(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/annunci/${id}/foto`);
  }
}
