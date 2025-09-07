// src/app/services/asta.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { BaseApiService } from './base-api.service';

export interface Asta {
    id: number;
    annuncio_id: number;
    prezzo_base: number;
    prezzo_corrente: number;
    ultimo_offerente_id?: number;
    offerte?: string;
    data_inizio: string;
    data_fine: string;
    stato: string;
}

@Injectable({
    providedIn: 'root'
})
export class AstaService extends BaseApiService<Asta> {

    constructor() {
        super('annunci');
    }

    getAstaByAnnuncio(annuncioId: number): Observable<Asta | null> {
        const url = `${environment.api.serverUrl}/annunci/${annuncioId}/asta`;
        console.debug('[Angular] Http GET asta by annuncio: ', url);

        return this.http.get<Asta>(url, { observe: 'response' })
            .pipe(
                map((resp: HttpResponse<Asta>) => resp.body ?? null),
                catchError(() => of(null))
            );
    }

    makeOffer(annuncioId: number, idOfferente: number, importo: number): Observable<Asta> {
        const url = `${environment.api.serverUrl}/annunci/${annuncioId}/asta/offerta`;
        console.debug('[Angular] Http POST make offer: ', url);

        return this.http.post<Asta>(url, { idOfferente, importo });
    }
}
