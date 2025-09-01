import { ActivatedRoute } from '@angular/router';
import {Component, inject, Input} from '@angular/core';
import {AnnuncioService} from "../../../services/api/annuncio.service";
import {AnnuncioModel} from "./annuncio.model";
import {ContactSellerComponent} from './contact-seller/contact-seller.component';
import {ReviewComponent} from './review/review.component';
import { UtenteService } from "../../../services/api/utente.service";
import {ReviewService} from '../../../services/api/review.service';
import {ReviewModel} from './review/review.model';
import {NgForOf, NgIf} from "@angular/common";
import {GOOGLE_MAPS_API_KEY} from "../../../../environments/google-maps-key";


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
export class AnnuncioComponent{

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


    @Input() lat!: number;
    @Input() lng!: number;

    map!: google.maps.Map;


    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            if (!id) return;

            this.annuncioService.getById(id).subscribe(data => {
                this.annuncio = data;

                this.lat = data.latitudine;
                this.lng = data.longitudine;

                this.loadGoogleMapsScript()
                    .then(() => {
                        this.loadMap();
                    })
                    .catch(err => {
                        console.error('Errore caricando Google Maps', err);
                    });


                this.utenteService.getById(data.venditore_id).subscribe(utente => {
                    this.venditore = utente;
                });

                this.reviewService.getByAnnuncioId(id).subscribe(recensioni => {
                    this.recensioni = recensioni;
                });
            });
        });
    }

    loadMap() {
        const mapOptions = {
            center: new google.maps.LatLng(this.lat, this.lng),
            zoom: 15
        };

        this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);

        new google.maps.Marker({
            position: new google.maps.LatLng(this.lat, this.lng),
            map: this.map
        });
    }

    scrollTo(id: string) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({behavior: 'smooth'});
        }
    }

    private loadGoogleMapsScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (document.getElementById('google-maps-script')) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.head.appendChild(script);
        });
    }
}

