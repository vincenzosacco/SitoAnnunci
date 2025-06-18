import {Component, Input, numberAttribute} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

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
  @Input({transform: numberAttribute}) venditoreId!: number;

  nome: string = '';
  email: string = '';
  messaggio: string = '';
  messaggioInviato: boolean = false;

  invioMessaggio() {
    console.log('Messaggio inviato:', {
      nome: this.nome,
      email: this.email,
      messaggio: this.messaggio
    });

    // Simula l'invio del messaggio e mostra conferma
    this.messaggioInviato = true;

    // Reset form dopo 3 secondi
    setTimeout(() => {
      this.messaggioInviato = false;
      this.nome = '';
      this.email = '';
      this.messaggio = '';
    }, 3000);
  }
}
