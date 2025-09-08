import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Annuncio } from './Annuncio';
import { AnnunciService } from '../../services/annunci.service';
import { MastodonIcon } from './Images';
import { Sold } from './Images';
import { PubblicitaService } from '../../services/pubblicita.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, DecimalPipe],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  annunci: Annuncio[] = [];
  loggedIn = false;
  private annuncioDaPubblicare: Annuncio | null = null;
  protected MastodonIconDataUrl = "data:image/png;base64," + MastodonIcon;
  protected SoldIconDataUrl = "data:image/png;base64," + Sold;

  // cache: annuncioId -> dataUrl (data:image/png;base64,...)
  private fotoCache = new Map<number, string>();

  // sottoscrizioni per pulire quando necessario
  private subs = new Subscription();

  // fallback immagine (metti nel tuo assets)
  private readonly fallbackImg = 'assets/no-image.png';

  constructor(
    private annunciService: AnnunciService,
    private pubblicitaService: PubblicitaService,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent inizializzato');

    // Controlla localStorage
    let msg = localStorage.getItem('msg');
      // Leggi dai query params: /home?msg=1
      const urlParams = new URLSearchParams(window.location.search);
      const numeroStr = urlParams.get('user');

      if (numeroStr && !isNaN(Number(numeroStr))) {
        localStorage.setItem('msg', numeroStr);
      }

      // Rimuovi il parametro 'msg' dall'URL senza ricaricare
      urlParams.delete('user');
      const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;
      this.location.replaceState(newUrl);

    // Carica gli annunci
    this.fetchAnnunci();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  fetchAnnunci(): void {
    const s = this.annunciService.getAnnunci().subscribe({
      next: dati => {
        // popola gli oggetti Annuncio
        this.annunci = dati.map((d: any) => Annuncio.fromJSON(d));

        // DEBUG: quali annunci hanno inVendita = false?
        const nonInVendita = dati.filter((d: any) => d.inVendita === false);
        console.log("Annunci con inVendita = false:", nonInVendita);

        // carica FOTO solo per gli annunci visibili (che corrispondono al venditore corrente)
        const venditoreId = Number(localStorage.getItem('msg'));
        const visible = this.annunci.filter(a => a.venditoreId === venditoreId);

        visible.forEach(a => this.loadFotoForAnnuncio(a));
      },
      error: err => console.error('Errore caricamento annunci:', err)
    });

    this.subs.add(s);
  }

  private loadFotoForAnnuncio(annuncio: Annuncio) {
    // se già in cache, nulla da fare
    if (this.fotoCache.has(annuncio.id)) return;

    const s = this.annunciService.getFotoAnnuncio(annuncio.id).subscribe({
      next: (base64Array: string[]) => {
        if (base64Array && base64Array.length > 0 && base64Array[0]) {
          const dataUrl = `data:image/png;base64,${base64Array[0]}`;
          this.fotoCache.set(annuncio.id, dataUrl);
        } else {
          // nessuna foto: setta fallback così il template mostra immagine di default
          this.fotoCache.set(annuncio.id, this.fallbackImg);
        }
      },
      error: err => {
        console.error(`Errore caricamento foto per annuncio ${annuncio.id}:`, err);
        this.fotoCache.set(annuncio.id, this.fallbackImg);
      }
    });

    this.subs.add(s);
  }

  /**
   * Usato dal template per ottenere l'url immagine da mettere in [src].
   * Non fa chiamate e ritorna subito (o fallback).
   */
  getFotoSrc(annuncio: Annuncio): string {
    return this.fotoCache.get(annuncio.id) ?? this.fallbackImg;
  }

  rimuoviAnnuncio(id: number): void {
    this.annunciService.rimuoviAnnuncio(id).subscribe({
      next: () => this.fetchAnnunci(),
      error: err => console.error('Errore rimozione annuncio:', err)
    });
  }

  loginMastodon(annuncio: Annuncio) {
    this.annuncioDaPubblicare = annuncio;
    this.pubblicitaService.getLoginUrl().subscribe(({ authUrl }) => {
      const popup = window.open(authUrl, 'Login Mastodon', 'width=600,height=700');
      if (!popup) {
        alert('Popup bloccato dal browser, permetti le finestre popup');
        return;
      }
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          this.loggedIn = true;
          alert('Login Mastodon completato!');
          if (this.annuncioDaPubblicare) {
            this.pubblicizza(this.annuncioDaPubblicare);
            this.annuncioDaPubblicare = null;
          }
        }
      }, 1000);
    });
  }

  pubblicizza(annuncio: Annuncio) {
    this.pubblicitaService.pubblicaSuMastodon(annuncio).subscribe({
      next: response => {
        if (response.success && response.url) window.location.href = response.url;
        else alert('Errore nella pubblicazione');
      },
      error: err => {
        console.error('Errore pubblicazione Mastodon:', err);
        alert('Errore di rete o server');
      }
    });
  }

  protected readonly localStorage = localStorage;
  protected readonly Number = Number;
}
