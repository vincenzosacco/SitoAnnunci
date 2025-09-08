// -------------------- AggiungiComponent.ts --------------------
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { AnnunciService } from '../../services/annunci.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-aggiungi',
  templateUrl: './aggiungi.component.html',
  styleUrls: ['./aggiungi.component.css'],
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf, NgForOf]
})
export class AggiungiComponent implements OnInit, OnDestroy {
  // Mappa
  latitudine: number | null = null;
  longitudine: number | null = null;
  map!: google.maps.Map;
  marker: google.maps.Marker | null = null;
  indirizzo: string = '';

  // Foto
  fotoNuove: string[] = [];

  tipoVendita: 'compra' | 'asta' = 'compra';
  categoriaId: number = 1;

  private subs = new Subscription();

  constructor(private annunciService: AnnunciService) {}

  ngOnInit(): void {
    this.loadGoogleMapsScript()
      .then(() => this.initMap())
      .catch(err => console.error(err));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // -------------------- GOOGLE MAPS --------------------
  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google?.maps) { resolve(); return; }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDHI3EEzM_-s0uuU0xZkLGUfiMhjeelsN8`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject('Impossibile caricare Google Maps');
      document.head.appendChild(script);
    });
  }

  private initMap(): void {
    const centro = { lat: 41.9028, lng: 12.4964 }; // Roma
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: centro,
      zoom: 6
    });

    this.map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.latitudine = lat;
      this.longitudine = lng;
      this.posizionaMarker(lat, lng);
      this.aggiornaCoordinate(lat, lng); // aggiorna indirizzo
    });
  }

  private posizionaMarker(lat: number, lng: number) {
    if (this.marker) this.marker.setMap(null);
    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map
    });
  }

  aggiornaCoordinate(lat: number, lng: number) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=it`)
      .then(r => r.json())
      .then(dati => {
        this.indirizzo = dati.display_name ?? 'Indirizzo non disponibile';
      })
      .catch(() => this.indirizzo = 'Errore nel recupero indirizzo');
  }

  // -------------------- GESTIONE FOTO --------------------
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filePromises = Array.from(input.files).map(file => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            let base64 = e.target.result as string;
            if (base64.includes(',')) base64 = base64.split(',')[1];
            this.fotoNuove.push(base64);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then(() => {
        console.log('Tutte le foto nuove selezionate sono pronte');
      });
    }
  }

  rimuoviFotoNuova(index: number) {
    this.fotoNuove.splice(index, 1);
  }

  private formatLocalDateTimeForBackend(date: Date): string {
    // produce "yyyy-MM-ddTHH:mm:ss" (senza timezone) — compatibile con LocalDateTime Jackson
    const pad = (n: number) => n.toString().padStart(2, '0');
    const Y = date.getFullYear();
    const M = pad(date.getMonth() + 1);
    const D = pad(date.getDate());
    const h = pad(date.getHours());
    const m = pad(date.getMinutes());
    const s = pad(date.getSeconds());
    return `${Y}-${M}-${D}T${h}:${m}:${s}`;
  }

  aggiornaTutto(titolo: string, descrizione: string, m2: number, prezzo: number) {
    // validazione minima
    if (!titolo || titolo.trim() === '') {
      alert('Inserisci un titolo.');
      return;
    }

    // prezzo passato come stringa/numero nel template: normalizziamo
    const prezzoRaw = (prezzo === undefined || prezzo === null) ? '' : String(prezzo).trim();
    if (prezzoRaw === '') {
      alert('Inserisci un prezzo.');
      return;
    }

    // sostituisci eventuali virgole e prova a convertire
    const prezzoNormalized = prezzoRaw.replace(',', '.');
    const prezzoNum = Number(prezzoNormalized);
    if (isNaN(prezzoNum)) {
      alert('Prezzo non valido.');
      return;
    }

    const idCasuale = Math.floor(Math.random() * (999999 - 1000 + 1)) + 1000;

    // venditore: prova a convertire localStorage msg in numero, altrimenti null
    const vendRaw = localStorage.getItem('msg');
    const vendId = vendRaw ? Number(vendRaw) : NaN;
    const venditoreIdOrNull = !isNaN(vendId) ? vendId : null;

    const dataCreazione = this.formatLocalDateTimeForBackend(new Date());

    const body: any = {
      id: idCasuale,
      titolo: titolo,
      descrizione: descrizione ?? null,
      superficie: (m2 === undefined || m2 === null || isNaN(Number(m2))) ? null : Number(m2),
      indirizzo: this.indirizzo ?? null,
      // invio più campi relativi al prezzo per coprire mapping diversi lato server
      prezzo: prezzoNum,
      prezzo_nuovo: prezzoNum,
      prezzoNuovo: prezzoNum,
      prezzoVecchio: prezzoNum,
      // venditore
      venditoreId: venditoreIdOrNull,
      venditore_id: venditoreIdOrNull,
      // categoria
      categoria_id: this.categoriaId,
      categoriaId: this.categoriaId,
      // coordinate
      latitudine: this.latitudine,
      longitudine: this.longitudine,
      // eventuale flag
      dataCreazione: dataCreazione, // invio stringa compatibile con LocalDateTime
      isChanged: true,
      placeId: 'place_11'
    };

    console.log('POST /create body:', body);

    // dentro aggiornaTutto(...)
    this.annunciService.createAnnuncio(body).subscribe({
      next: (res: any) => {
        console.log('Annuncio creato (risposta):', res);
        const createdId = (res && (res.id || res.getId)) ? (res.id ?? res.getId) : idCasuale;

        // se è un'asta: chiama endpoint per inserire id nella tabella asta
        if (this.tipoVendita === 'asta') {
          this.annunciService.addAsta({ id: createdId, prezzoBase: prezzoNum }).subscribe({
            next: () => {
              console.log('Asta registrata per annuncio', createdId);
              this.savePhotosAfterCreate(createdId);
            },
            error: err => {
              console.error('Errore registrazione asta:', err);
              alert('Annuncio creato, ma errore nel registrare l\'asta.');
            }
          });
        } else {
          // normale vendita: salva foto e fine
          this.savePhotosAfterCreate(createdId);
        }
      },
      error: err => {
        console.error('Errore durante il salvataggio:', err);
        alert('Errore durante il salvataggio dell\'annuncio. Vedi console.');
      }
    });
  }

  private savePhotosAfterCreate(createdId: number) {
    if (this.fotoNuove.length > 0) {
      const calls = this.fotoNuove.map(foto => this.annunciService.addPhoto(createdId, foto));
      forkJoin(calls).subscribe({
        next: () => {
          this.fotoNuove = [];
          alert('Annuncio e foto salvati con successo!');
        },
        error: err => {
          console.error('Errore salvataggio foto:', err);
          alert('Annuncio creato, ma errore nel salvataggio delle foto.');
        }
      });
    } else {
      alert('Annuncio salvato con successo!');
    }
  }
    // Per usare Number in template
  public readonly Number = Number;
}
