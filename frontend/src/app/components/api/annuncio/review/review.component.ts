import {Component, Input, numberAttribute} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ReviewService} from '../../../../services/api/review.service';
import {AuthService} from "@auth0/auth0-angular";
import {Router} from "@angular/router";
import {take} from "rxjs";
import {UtenteService} from "../../../../services/api/utente.service";

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

  autore_id: number | null = null;

  constructor(private reviewService: ReviewService,
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

  inviaRecensione() {

    if (!this.autore_id) {
        this.router.navigate(['/no-auth-redirect']);
        return;
    }

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
