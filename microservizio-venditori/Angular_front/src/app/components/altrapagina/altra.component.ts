import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AnnunciService } from '../../services/annunci.service';
import { NgIf } from '@angular/common';

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
  imports: [FormsModule, RouterLink, NgIf]
})
export class AltraComponent implements OnInit, AfterViewInit {
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
    prezzovecchio: 0,
  };
  fotoBase64: string | null = null;

  // centro di Roma (fallback)
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

  // aspetta che il view DOM sia pronto prima di creare la mappa
  ngAfterViewInit(): void {
    this.loadGoogleMapsScript()
      .then(() => this.initMap())
      .catch(err => console.error(err));
  }

  public loadAnnuncio() {
    this.annunciService.getAnnuncioById(this.id).subscribe({
      next: data => {
        this.annuncio = {
          titolo: data.titolo ?? '',
          superficie: data.superficie ?? null,
          descrizione: data.descrizione ?? '',
          indirizzo: data.indirizzo ?? '',
          latitudine: data.latitudine ?? null,
          longitudine: data.longitudine ?? null,
          prezzonuovo: data.prezzoNuovo ?? 0,
          prezzovecchio: data.prezzoVecchio ?? 0,
        };

        // salva coordinate locali
        this.latitudine = this.annuncio.latitudine;
        this.longitudine = this.annuncio.longitudine;

        // quando arrivano i dati: se la mappa è già inizializzata, aggiorna marker/centro
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

  private getIndirizzoDaCoordinate(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=it`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          this.annuncio.indirizzo = data.display_name;
        } else {
          console.warn("Nessun indirizzo trovato per queste coordinate.");
        }
      })
      .catch(err => console.error("Errore reverse geocoding:", err));
  }

  private initMap() {
    // assicuriamoci che esista l'elemento map
    const mapEl = document.getElementById('map');
    if (!mapEl) {
      console.error('Elemento #map non trovato nel DOM');
      return;
    }

    // calcola lat/lng iniziali: se API ha 0 o null -> usa Roma
    const lat = this.getValidLatLng(this.latitudine, this.roma.lat);
    const lng = this.getValidLatLng(this.longitudine, this.roma.lng);

    this.map = new google.maps.Map(mapEl as HTMLElement, {
      center: { lat, lng },
      zoom: 12
    });

    // posiziona marcatore iniziale
    this.posizionaMarker(lat, lng);

    // click listener per aggiornare coordinate (e mostrare marker)
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

  // helper: se valore è null/undefined o estremamente vicino a zero, usa fallback
  private getValidLatLng(value: number | null, fallback: number): number {
    if (value === null || value === undefined) return fallback;
    // considera 0 (o molto vicino a 0) come "non valido" (ad es. 0,0 coord di default db)
    if (Math.abs(value) < 1e-6) return fallback;
    return Number(value);
  }

  aggiornaTutto(): void {
    const lat: number | null = this.latitudine !== null ? Number(this.latitudine) : null;
    const lng: number | null = this.longitudine !== null ? Number(this.longitudine) : null;

    const calls = [
      this.annunciService.aggiornaSpecData(this.id, 'titolo', this.annuncio.titolo),
      this.annunciService.aggiornaSpecData(this.id, 'superficie', this.annuncio.superficie),
      this.annunciService.aggiornaSpecData(this.id, 'descrizione', this.annuncio.descrizione),
      this.annunciService.aggiornaSpecData(this.id, 'indirizzo', this.annuncio.indirizzo),
      this.annunciService.aggiornaSpecData(this.id, 'latitudine', lat),
      this.annunciService.aggiornaSpecData(this.id, 'longitudine', lng),
      this.annunciService.aggiornaSpecData(this.id, 'prezzonuovo', this.annuncio.prezzonuovo),
      this.annunciService.aggiornaSpecData(this.id, 'prezzovecchio', this.annuncio.prezzovecchio)
    ];

    if (this.fotoBase64) {
      calls.push(this.annunciService.aggiornaSpecData(this.id, 'foto', this.fotoBase64.replace(/\s+/g, '')));
    }

    forkJoin(calls).subscribe({
      next: results => {
        console.log('Aggiornamento completato:', results);
        alert('Aggiornamento completato!');
      },
      error: err => {
        console.error('Errore durante aggiornamento:', err);
        alert('Errore durante l\'aggiornamento. Vedi console.');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => this.fotoBase64 = reader.result as string;
    reader.readAsDataURL(file);
  }

  stampaCoordinate(): void {
    if (this.latitudine !== null && this.longitudine !== null) {
      console.log('Latitudine:', this.latitudine, 'Longitudine:', this.longitudine);
    } else {
      console.warn('Seleziona una posizione sulla mappa.');
    }
  }
}
