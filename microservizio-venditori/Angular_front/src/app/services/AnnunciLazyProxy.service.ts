import { Injectable } from '@angular/core';
import { AnnunciService } from './annunci.service';
import { Annuncio } from '../components/home/Annuncio'
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnnunciLazyProxyServiceProxyService {
  private cacheAnnunci: Annuncio[] | null = null;

  constructor(private annunciService: AnnunciService) {}

  getAnnunci(): Observable<Annuncio[]> {
    if (this.cacheAnnunci) {
      return of(this.cacheAnnunci);
    } else {
      return this.annunciService.getAnnunci().pipe(
        tap(annunci => this.cacheAnnunci = annunci)
      );
    }
  }

  rimuoviAnnuncio(id: number): Observable<void> {
    return new Observable<void>(observer => {
      this.annunciService.rimuoviAnnuncio(id).subscribe({
        next: () => {
          this.cacheAnnunci = null;
          observer.next();
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }
}
