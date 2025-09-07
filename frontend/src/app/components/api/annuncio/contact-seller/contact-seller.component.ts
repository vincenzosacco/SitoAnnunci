import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ChatService} from "../../../../services/api/chat.service";
import {Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import {take} from "rxjs";
import {UtenteService} from "../../../../services/api/utente.service";

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

    @Input() venditoreId: number = 0;
    @Input() annuncioId: number = 0;
    @Input() annuncioTitolo: string = '';

    nome = '';
    email = '';
    messaggio = '';
    messaggioInviato = false;

    autore_id: number | null = null;

    constructor(private chatService: ChatService,
                private authService: AuthService,
                private router: Router,
                private utenteService: UtenteService) {}

    ngOnInit() {
        this.authService.user$.pipe(take(1)).subscribe(user => {
            if (user?.email) {
                this.utenteService.getByEmail(user.email).subscribe(dbUser => {
                    this.autore_id = dbUser.id;
                });
            }
        });
    }

    invioMessaggio() {

        if(!this.autore_id){
            this.router.navigate(['/no-auth-redirect']);
            return;
        }

        if (!this.messaggio.trim()) return;

        const msg = {
            senderId: this.autore_id,
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
