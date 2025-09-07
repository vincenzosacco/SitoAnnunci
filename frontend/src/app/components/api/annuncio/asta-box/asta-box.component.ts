import {Component, Input, numberAttribute} from '@angular/core';
import {CurrencyPipe, DatePipe, NgIf} from '@angular/common';

import {Asta, AstaService} from "../../../../services/api/asta.service";
import {finalize} from "rxjs";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-asta-box',
    imports: [
        FormsModule,
        NgIf,
        DatePipe,
        CurrencyPipe
    ],
  templateUrl: './asta-box.component.html',
  styleUrl: './asta-box.component.css'
})
export class AstaBoxComponent {
    @Input({transform: numberAttribute}) annuncioId!: number;

    asta: Asta | null = null;
    offertaValue: number | null = null;
    loading = false;
    message = '';

    constructor(private astaService: AstaService) { }

    ngOnInit(): void {
        if (!this.annuncioId) return;

        /* MOCK solo per test
        this.asta = {
            id: 1,
            annuncio_id: this.annuncioId,
            prezzo_base: 100000,
            prezzo_corrente: 105000,
            data_inizio: new Date().toISOString(),
            data_fine: new Date(Date.now() + 3600000).toISOString(),
            stato: 'ATTIVA'
        };*/

        this.loadAsta();
    }

    loadAsta(): void {
        this.astaService.getAstaByAnnuncio(this.annuncioId).subscribe(res => {
            this.asta = res;
        });
    }

    faiOfferta(): void {
        if (!this.asta || this.offertaValue == null) {
            this.message = 'Inserisci un importo valido';
            return;
        }

        if (this.offertaValue <= this.asta.prezzo_corrente) {
            this.message = `L'offerta deve essere maggiore del prezzo corrente (${this.asta.prezzo_corrente} €)`;
            return;
        }

        this.loading = true;
        this.message = '';

        // idOfferente potrebbe essere preso dal login dell'utente
        const idOfferente = 1; // esempio statico, sostituire con utente loggato

        this.astaService.makeOffer(this.annuncioId, idOfferente, this.offertaValue)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: updatedAsta => {
                    this.asta = updatedAsta;
                    this.offertaValue = null;
                    this.message = 'Offerta inviata con successo!';
                },
                error: err => {
                    console.error(err);
                    this.message = 'Errore durante l\'invio dell\'offerta.';
                }
            });
    }
}
