import {Component, inject, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ChatService} from "../../../../services/api/chat.service";

@Component({
  selector: 'app-contact-seller',
  templateUrl: './contact-seller.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./contact-seller.component.css']
})
export class ContactSellerComponent {
    private chatService = inject(ChatService);

    @Input() venditoreId: number = 0;
    @Input() annuncioId: number = 0;
    @Input() annuncioTitolo: string = '';

    mioId = 2; // TODO: da sostituire con id utente loggato

    nome = '';
    email = '';
    messaggio = '';
    messaggioInviato = false;

    invioMessaggio() {
        if (!this.messaggio.trim()) return;

        const msg = {
            senderId: this.mioId,
            addresseeId: this.venditoreId,
            text: `Codice Annuncio #${this.annuncioId} - ${this.annuncioTitolo}\n\n${this.messaggio}`
        };

        this.chatService.inviaMessaggio(msg).subscribe({
            next: () => {
                this.messaggioInviato = true;
                this.nome = '';
                this.email = '';
                this.messaggio = '';
            },
            error: (err) => {
                console.error('Errore invio messaggio:', err);
            }
        });
    }
}
