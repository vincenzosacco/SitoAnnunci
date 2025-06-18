import { ActivatedRoute } from '@angular/router';
import {Component, inject} from '@angular/core';
import {AnnuncioService} from "../../../services/api/annuncio.service";
import {AnnuncioModel} from "./annuncio.model";
import {ContactSellerComponent} from './contact-seller/contact-seller.component';
import {ReviewComponent} from './review/review.component';
import { UtenteService } from "../../../services/api/utente.service";
import {ReviewService} from '../../../services/api/review.service';
import {ReviewModel} from './review/review.model';
import {DecimalPipe} from '@angular/common';


@Component({
  selector: 'app-annuncio',
  imports: [
    ContactSellerComponent,
    ReviewComponent,
    DecimalPipe
  ],
  templateUrl: './annuncio.component.html',
  styleUrl: './annuncio.component.css'
})
export class AnnuncioComponent {
  private annuncioService = inject(AnnuncioService);
  private utenteService = inject(UtenteService);
  private route = inject(ActivatedRoute);
  private reviewService = inject(ReviewService);

  annuncio: AnnuncioModel | undefined;
  venditore: any;

  mediaRecensioni: number | null = null;
  recensioni: ReviewModel[] = [];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.annuncioService.getById(id).subscribe(data => {
      this.annuncio = data;

      if (data.utenteId) {
        this.utenteService.getById(data.utenteId).subscribe(utente => {
          this.venditore = utente;
        });
      }

      // Dopo aver ottenuto l'annuncio, prendi le sue recensioni
      this.reviewService.getAll().subscribe(recensioni => {
        this.recensioni = recensioni.filter(r => r.annuncioId === id);
        this.calcolaMedia();
      });
    });
  }

  calcolaMedia(){
    if(this.recensioni.length === 0){
      this.mediaRecensioni = null;
      return;
    }
    const somma = this.recensioni.reduce((acc, r) => acc + Number(r.voto), 0);

    this.mediaRecensioni = somma / this.recensioni.length;

  }
}

