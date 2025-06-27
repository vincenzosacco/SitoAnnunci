import { ActivatedRoute } from '@angular/router';
import {Component, inject} from '@angular/core';
import {AnnuncioService} from "../../../services/api/annuncio.service";
import {AnnuncioModel} from "./annuncio.model";
import {ContactSellerComponent} from './contact-seller/contact-seller.component';
import {ReviewComponent} from './review/review.component';
import { UtenteService } from "../../../services/api/utente.service";
import {ReviewService} from '../../../services/review.service';
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

  categoriaMap: Record<number, string> = {
      1: 'Appartamento',
      2: 'Villa',
      3: 'Attico',
      4: 'Monolocale',
      5: 'Terreno',
      6: 'Box Auto',
      7: 'Ufficio'
  };

  private annuncioService = inject(AnnuncioService);
  private utenteService = inject(UtenteService);
  private route = inject(ActivatedRoute);
  private reviewService = inject(ReviewService);

  annuncio: AnnuncioModel | undefined;
  venditore: any;

  numeroRecensioni: number = 0;
  mediaRecensioni: number = 0;
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


      this.reviewService.getAll().subscribe(recensioni => {
        this.recensioni = recensioni.filter(r => r.annuncioId === id);
        this.calcolaMedia();
      });
    });
  }

  calcolaMedia(){
    if(this.recensioni.length === 0){
      this.mediaRecensioni = 0;
      return;
    }
    const somma = this.recensioni.reduce((acc, r) => acc + Number(r.voto), 0);

    this.mediaRecensioni = somma / this.recensioni.length;

  }
}

