// `src/app/services/chat.service.ts`
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseApiService} from "./base-api.service";

export interface Messaggio {
    id: number;
    mittente_id: number;
    destinatario_id: number;
    testo: string;
    data: number;
    conversazione_id: number;
}

@Injectable({ providedIn: 'root' })

export class ChatService extends BaseApiService<Messaggio>{

    constructor(){
        super('messaggi');
    }

    getConversazioni(utenteId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.endpointUrl}/conversazioni/${utenteId}`);
    }

    getMessaggi(utente1: number, utente2: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.endpointUrl}/conversazione?utente1=${utente1}&utente2=${utente2}`
        );
    }

    inviaMessaggio(msg: { senderId: number, addresseeId: number, text: string }): Observable<any> {
        return this.http.post(`${this.endpointUrl}`, msg);
    }
}
