import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../services/api/chat.service';
import {FormsModule} from "@angular/forms";
import {AuthService} from "@auth0/auth0-angular";
import {take} from "rxjs";
import {UtenteService} from "../../../services/api/utente.service";

@Component({
  selector: 'app-chat',
    imports: [CommonModule,
        FormsModule
    ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
    constructor(private chatService: ChatService, private authService: AuthService, private utenteService: UtenteService) {
    }

    utenti: any[] = [];
    messaggi: any[] = [];
    utenteSelezionato: any = null;
    nuovoMessaggio: string = '';
    mioId: number | null = null;

    ngOnInit() {
        this.authService.user$.pipe(take(1)).subscribe(user => {
            if (user?.email) {
                this.utenteService.getByEmail(user.email).subscribe(dbUser => {
                    this.mioId = dbUser.id;
                    this.caricaUtenti();
                });
            }
        });

    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }

    caricaUtenti() {
        if (this.mioId == null) return;
        this.chatService.getConversazioni(this.mioId).subscribe(data => {
            this.utenti = data.map(u => ({
                id: u.id,
                nome: u.nome,
                conversazione_id: u.conversazione_id
            }));
        });
    }

    selezionaUtente(utente: any) {
        if (this.mioId == null) return;

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
        if (this.mioId == null) return;

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
