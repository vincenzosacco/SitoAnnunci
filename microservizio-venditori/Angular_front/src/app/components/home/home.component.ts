import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Annuncio } from './Annuncio';
import { AnnunciService } from '../../services/annunci.service';
import { MastodonIcon } from './Images';
import { PubblicitaService } from '../../services/pubblicita.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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

  // mappa foto per annuncio: annuncioId => array di foto base64
  fotoMap = new Map<number, string[]>();

  constructor(
    private annunciService: AnnunciService,
    private pubblicitaService: PubblicitaService,
    private router: Router,
    private location: Location,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent inizializzato');
    this.handleQueryParams();
    this.fetchAnnunci();
  }

  fetchAnnunci(): void {
    this.annunciService.getAnnunci().subscribe({
      next: dati => {
        console.log('Dati dal backend:', dati);
        this.annunci = dati.map((d: any) => Annuncio.fromJSON(d));
        this.annunci.forEach(a => this.loadFotoAnnuncio(a.id));
      },
      error: err => console.error('Errore caricamento annunci:', err)
    });
  }

  // carica le foto di un annuncio e le mette in fotoMap
  loadFotoAnnuncio(annuncioId: number) {
    console.log('Chiamata loadFotoAnnuncio per annuncioId:', annuncioId);

    this.annunciService.getFotoAnnuncio(annuncioId).subscribe({
      next: (base64Array: string[]) => {
        // Prepend data URL
        const dataUrls = base64Array.map(b64 => 'data:image/png;base64,' + b64);
        this.fotoMap.set(annuncioId, dataUrls);

        // Imposta la prima foto
        const imgEl = this.elRef.nativeElement.querySelector(`#foto-annuncio-${annuncioId}`);
        if (imgEl && dataUrls.length > 0) imgEl.src = dataUrls[0];

        console.log(`Annuncio ID: ${annuncioId}`, dataUrls[0]);
      },
      error: err => console.error('Errore caricamento foto:', err)
    });
  }

  // converte Uint8Array / byte[] in base64
  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
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

  private handleQueryParams(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg) {
      localStorage.setItem('msg', msg);
      urlParams.delete('msg');
      const newUrl = urlParams.toString() ? `${window.location.pathname}?${urlParams.toString()}` : window.location.pathname;
      this.location.replaceState(newUrl);
    }
  }

  protected readonly localStorage = localStorage;
  protected readonly Number = Number;
}
