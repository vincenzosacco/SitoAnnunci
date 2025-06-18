import {Component, Input, numberAttribute} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ReviewService} from '../../../../services/api/review.service';
import {ReviewModel} from './review.model';

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
  @Input({transform: numberAttribute}) annuncioId!: number;

  nome: string = '';
  voto: number | null = null;
  commento: string = '';
  recensioneInviata: boolean = false;

  utenteId: number = 1;//temporaneamente tutte le recensioni provengono dall'utente 1

  constructor(private reviewService: ReviewService) {}

  inviaRecensione() {
    if (!this.nome || !this.voto) {
      // magari qui metti un alert o messaggio di validazione
      return;
    }

    const nuovaRecensione: Omit<ReviewModel, 'id'> = {
      annuncioId: this.annuncioId,
      utenteId: this.utenteId,
      nome: this.nome,
      voto: this.voto,
      commento: this.commento
    };

    this.reviewService.addReview(nuovaRecensione).subscribe({
      next: (res) => {
        console.log('Recensione salvata:', res);
        this.recensioneInviata = true;
        this.resetForm();
      },
      error: (err) => {
        console.error('Errore nell\'invio della recensione:', err);
        // qui puoi mostrare un messaggio d'errore all'utente
      }
    });
  }

  resetForm() {
    this.nome = '';
    this.voto = null;
    this.commento = '';

    setTimeout(() => {
      this.recensioneInviata = false;
    }, 3000);
  }
}
