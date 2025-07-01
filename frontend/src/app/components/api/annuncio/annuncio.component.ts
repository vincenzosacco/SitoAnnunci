import { ActivatedRoute } from '@angular/router';
import {Component, inject} from '@angular/core';
import {AnnuncioService} from "../../../services/api/annuncio.service";
import {AnnuncioModel} from "./annuncio.model";
import {ContactSellerComponent} from './contact-seller/contact-seller.component';
import {ReviewComponent} from './review/review.component';
import { UtenteService } from "../../../services/api/utente.service";
import {ReviewService} from '../../../services/api/review.service';
import {ReviewModel} from './review/review.model';
import {NgForOf, NgIf} from "@angular/common";


@Component({
  selector: 'app-annuncio',
    imports: [
        ContactSellerComponent,
        ReviewComponent,
        NgIf,
        NgForOf,
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

    annuncio?: AnnuncioModel;
    venditore: any;

    recensioni: ReviewModel[] = [];


    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            if (!id) return;

            this.annuncioService.getById(id).subscribe(data => {
                this.annuncio = data;

                this.utenteService.getById(data.venditore_id).subscribe(utente => {
                    this.venditore = utente;
                });

                this.reviewService.getByAnnuncioId(id).subscribe(recensioni => {
                    this.recensioni = recensioni;
                });
            });
        });
    }


    scrollTo(id: string) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({behavior: 'smooth'});
        }
    }
}

