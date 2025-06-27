import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../services/api/chat.service';
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-chat',
    imports: [CommonModule,
        FormsModule
    ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
    private chatService = inject(ChatService);

    utenti: any[] = [];
    messaggi: any[] = [];
    mioId = 9; // #TODO Da sostituire con ID dell’utente loggato
    utenteSelezionato: any = null;
    nuovoMessaggio: string = '';

    ngOnInit() {
        this.caricaUtenti();
    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }

    caricaUtenti() {
        this.chatService.getConversazioni(this.mioId).subscribe(data => {
            this.utenti = data.map(u => ({
                id: u.id,
                nome: u.nome,
                conversazione_id: u.conversazione_id
            }));
        });
    }

    selezionaUtente(utente: any) {
        this.utenteSelezionato = utente;

        this.chatService.getMessaggi(this.mioId, utente.id).subscribe(data => {
            this.messaggi = data.map(m => ({
                senderId: m.senderId,
                addresseeId: m.addresseeId,
                text: m.text,
                date: m.date,
                conversationId: m.conversationId
            }));
        });
    }

    inviaMessaggio() {
        if (!this.nuovoMessaggio.trim()) return;

        const messaggio = {
            senderId: this.mioId,
            addresseeId: this.utenteSelezionato.id,
            text: this.nuovoMessaggio
        };

        this.chatService.inviaMessaggio(messaggio).subscribe(() => {
            this.nuovoMessaggio = '';
            this.selezionaUtente(this.utenteSelezionato);
        });
    }
}
