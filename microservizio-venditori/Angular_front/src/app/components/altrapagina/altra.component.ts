import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { AnnunciService } from '../../services/annunci.service';
import { NgIf, NgFor } from '@angular/common';

interface Annuncio {
  titolo: string;
  superficie: number | null;
  descrizione: string;
  indirizzo: string;
  latitudine: number | null;
  longitudine: number | null;
  prezzonuovo: number;
  prezzovecchio: number;
}

@Component({
  selector: 'app-altra',
  templateUrl: './altra.component.html',
  styleUrls: ['./altra.component.css'],
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf, NgFor]
})
export class AltraComponent implements OnInit, AfterViewInit, OnDestroy {
  id!: number;
  latitudine: number | null = null;
  longitudine: number | null = null;
  map!: google.maps.Map;
  marker: google.maps.Marker | null = null;

  annuncio: Annuncio = {
    titolo: '',
    superficie: null,
    descrizione: '',
    indirizzo: '',
    latitudine: null,
    longitudine: null,
    prezzonuovo: 0,
    prezzovecchio: 0
  };

  // --- FOTO ---
  fotoPreesistenti: string[] = [];
  fotoNuove: string[] = [];

  // Cache e fallback come in HomeComponent
  private fotoCache = new Map<number, string[]>();
  protected readonly fallbackImg = 'assets/no-image.png';
  private subs = new Subscription();

  // Conserviamo il prezzo corrente così lo possiamo mettere in prezzovecchio prima dell'update
  private originalPrezzoNuovo: number | null = null;

  private readonly roma = { lat: 41.9028, lng: 12.4964 };

  constructor(private route: ActivatedRoute, private annunciService: AnnunciService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const paramId = params.get('id');
      if (paramId) {
        this.id = Number(paramId);
        this.loadAnnuncio();
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadGoogleMapsScript()
      .then(() => this.initMap())
      .catch(err => console.error(err));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // --- CARICAMENTO ANNUNCIO ---
  public loadAnnuncio() {
    this.annunciService.getAnnuncioById(this.id).subscribe({
      next: data => {
        // popolo annuncio con dati dal backend
        this.annuncio = {
          titolo: data.titolo ?? '',
          superficie: data.superficie ?? null,
          descrizione: data.descrizione ?? '',
          indirizzo: data.indirizzo ?? '',
          latitudine: data.latitudine ?? null,
          longitudine: data.longitudine ?? null,
          prezzonuovo: data.prezzoNuovo ?? 0,
          prezzovecchio: data.prezzoVecchio ?? 0
        };

        // salvo il prezzo corrente così posso metterlo in prezzovecchio prima dell'update
        this.originalPrezzoNuovo = (data.prezzoNuovo != null) ? Number(data.prezzoNuovo) : null;

        this.latitudine = this.annuncio.latitudine;
        this.longitudine = this.annuncio.longitudine;

        // --- FOTO: usa il metodo di HomeComponent ---
        this.loadFotoForAnnuncio(this.id);

        if (this.map) {
          const lat = this.getValidLatLng(this.latitudine, this.roma.lat);
          const lng = this.getValidLatLng(this.longitudine, this.roma.lng);
          this.posizionaMarker(lat, lng);
          this.map.setCenter({ lat, lng });
          this.map.setZoom(12);
        }
      },
      error: err => console.error('Errore caricamento annuncio:', err)
    });
  }

  // --- METODO RIUTILIZZATO DA HOME COMPONENT ---
  private loadFotoForAnnuncio(annuncioId: number) {
    if (this.fotoCache.has(annuncioId)) {
      this.fotoPreesistenti = this.fotoCache.get(annuncioId)!;
      return;
    }

    const s = this.annunciService.getFotoAnnuncio(annuncioId).subscribe({
      next: (base64Array: string[]) => {
        let fotos: string[];
        if (base64Array && base64Array.length > 0) {
          fotos = base64Array.map(f => `data:image/png;base64,${f}`);
        } else {
          fotos = [this.fallbackImg];
        }
        this.fotoCache.set(annuncioId, fotos);
        this.fotoPreesistenti = fotos;
      },
      error: err => {
        console.error(`Errore caricamento foto per annuncio ${annuncioId}:`, err);
        const fotos = [this.fallbackImg];
        this.fotoCache.set(annuncioId, fotos);
        this.fotoPreesistenti = fotos;
      }
    });
    this.subs.add(s);
  }

  // --- GOOGLE MAPS ---
  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google?.maps) { resolve(); return; }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=LA_TUA_API_KEY`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject('Impossibile caricare Google Maps');
      document.head.appendChild(script);
    });
  }

  private initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl) { console.error('Elemento #map non trovato nel DOM'); return; }

    const lat = this.getValidLatLng(this.latitudine, this.roma.lat);
    const lng = this.getValidLatLng(this.longitudine, this.roma.lng);

    this.map = new google.maps.Map(mapEl as HTMLElement, { center: { lat, lng }, zoom: 12 });
    this.posizionaMarker(lat, lng);

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      this.latitudine = event.latLng.lat();
      this.longitudine = event.latLng.lng();
      this.posizionaMarker(this.latitudine, this.longitudine);
    });
  }

  private posizionaMarker(lat: number, lng: number) {
    if (!this.map) return;
    if (this.marker) this.marker.setMap(null);
    this.marker = new google.maps.Marker({ position: { lat, lng }, map: this.map });
    this.getIndirizzoDaCoordinate(lat, lng);
  }

  private getValidLatLng(value: number | null, fallback: number): number {
    if (value === null || value === undefined) return fallback;
    if (Math.abs(value) < 1e-6) return fallback;
    return Number(value);
  }

  private getIndirizzoDaCoordinate(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=it`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) this.annuncio.indirizzo = data.display_name;
      })
      .catch(err => console.error("Errore reverse geocoding:", err));
  }

  // --- GESTIONE FOTO ---
  onFilesSelected(event: Event) {
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

  rimuoviFotoPreesistente(index: number) {
    this.annunciService.removePhotoByIndex(this.id, index).subscribe({
      next: () => {
        this.fotoPreesistenti.splice(index, 1);
        console.log(`Foto index ${index} rimossa con successo`);
      },
      error: err => {
        console.error('Errore rimozione foto:', err);
        alert('Errore rimozione foto. Controlla console.');
      }
    });
  }

  rimuoviFotoNuova(index: number) {
    this.fotoNuove.splice(index, 1);
  }

  aggiornaTutteLeFoto(): void {
    if (this.fotoNuove.length === 0) return;

    const calls = this.fotoNuove.map(foto => this.annunciService.addPhoto(this.id, foto));
    forkJoin(calls).subscribe({
      next: res => {
        console.log('Foto nuove salvate:', res);
        this.fotoNuove = [];
        alert('Foto salvate correttamente!');
      },
      error: err => {
        console.error('Errore salvataggio foto:', err);
        alert('Errore salvataggio foto. Controlla console.');
      }
    });
  }

  // --- AGGIORNAMENTO DATI (con gestione corretta dei prezzi) ---
  aggiornaTutto(): void {
    const lat = this.latitudine ?? null;
    const lng = this.longitudine ?? null;

    // prendo il prezzo precedente (quello caricato da DB)
    const previousPrice = this.originalPrezzoNuovo;
    const newPrice = this.annuncio.prezzonuovo;

    // Prepariamo le chiamate per gli altri campi
    const calls = [
      this.annunciService.aggiornaSpecData(this.id, 'titolo', this.annuncio.titolo),
      this.annunciService.aggiornaSpecData(this.id, 'superficie', this.annuncio.superficie),
      this.annunciService.aggiornaSpecData(this.id, 'descrizione', this.annuncio.descrizione),
      this.annunciService.aggiornaSpecData(this.id, 'indirizzo', this.annuncio.indirizzo),
      this.annunciService.aggiornaSpecData(this.id, 'latitudine', lat),
      this.annunciService.aggiornaSpecData(this.id, 'longitudine', lng)
    ];

    // Se il prezzo è cambiato (e avevamo un prezzo precedente), salviamo prima previous->prezzovecchio,
    // poi il nuovo in prezzonuovo. Altrimenti aggiorniamo solo prezzonuovo.
    if (previousPrice !== null && previousPrice !== newPrice) {
      calls.push(this.annunciService.aggiornaSpecData(this.id, 'prezzo', previousPrice));
      calls.push(this.annunciService.aggiornaSpecData(this.id, 'prezzo_nuovo', newPrice));
    } else {
      // anche se non è cambiato, aggiorniamo comunque prezzonuovo (idempotente)
      calls.push(this.annunciService.aggiornaSpecData(this.id, 'prezzo_nuovo', newPrice));
    }

    forkJoin(calls).subscribe({
      next: () => {
        // aggiorniamo la copia locale del "prezzo originale" dopo il successo
        this.originalPrezzoNuovo = newPrice;

        // aggiornamento foto (solo se ci sono nuove foto)
        if (this.fotoNuove.length > 0) {
          this.aggiornaTutteLeFoto();
        } else {
          alert('Dati salvati correttamente!');
        }
      },
      error: err => {
        console.error('Errore aggiornamento dati:', err);
        alert('Errore aggiornamento dati. Controlla console.');
      }
    });
  }
}
