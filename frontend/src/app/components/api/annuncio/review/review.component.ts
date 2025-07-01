import {Component, Input, numberAttribute} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ReviewService} from '../../../../services/api/review.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
  @Input({transform: numberAttribute}) annuncio_id!: number;

  nome_autore: string = '';
  voto: number | null = null;
  testo: string = '';
  recensioneInviata: boolean = false;

  autore_id: number = 2; // #TODO: da sostituire con id utente loggato

  constructor(private reviewService: ReviewService) {}

  inviaRecensione() {
    if (!this.nome_autore || !this.voto) {
      return;
    }

    const nuovaRecensione = {
      annuncio_id: this.annuncio_id,
      autore_id: this.autore_id,
      nome_autore: this.nome_autore,
      voto: this.voto,
      testo: this.testo
    };

      console.log("Payload recensione da inviare:", nuovaRecensione);

    this.reviewService.addReview(nuovaRecensione).subscribe({
      next: (res) => {
        console.log('Recensione salvata:', res);
        this.recensioneInviata = true;
        this.resetForm();
      },
      error: (err) => {
        console.error('Errore nell\'invio della recensione:', err);
      }
    });
  }

  resetForm() {
    this.nome_autore = '';
    this.voto = null;
    this.testo = '';

    setTimeout(() => {
      this.recensioneInviata = false;
    }, 3000);
  }
}
