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
  categoriaId?: number | null;
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
    prezzovecchio: 0,
    categoriaId: null
  };

  // --- FOTO ---
  fotoPreesistenti: string[] = [];
  fotoNuove: string[] = [];
  private fotoCache = new Map<number, string[]>();
  protected readonly fallbackImg = 'assets/no-image.png';
  private subs = new Subscription();

  selectedCategoryId: number | null = null;
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
        this.annuncio = {
          titolo: data.titolo ?? '',
          superficie: data.superficie ?? null,
          descrizione: data.descrizione ?? '',
          indirizzo: data.indirizzo ?? '',
          latitudine: data.latitudine ?? null,
          longitudine: data.longitudine ?? null,
          prezzonuovo: data.prezzoNuovo ?? 0,
          prezzovecchio: data.prezzoVecchio ?? 0,
          categoriaId: (data.categoriaId) ?? null
        };
        this.selectedCategoryId = this.annuncio.categoriaId ?? null;
        this.originalPrezzoNuovo = (data.prezzoNuovo != null) ? Number(data.prezzoNuovo) : null;
        this.latitudine = this.annuncio.latitudine;
        this.longitudine = this.annuncio.longitudine;
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

  // --- FOTO ---
  private loadFotoForAnnuncio(annuncioId: number) {
    if (this.fotoCache.has(annuncioId)) {
      this.fotoPreesistenti = this.fotoCache.get(annuncioId)!;
      return;
    }

    const s = this.annunciService.getFotoAnnuncio(annuncioId).subscribe({
      next: (base64Array: string[]) => {
        const fotos = (base64Array && base64Array.length > 0)
          ? base64Array.map(f => `data:image/png;base64,${f}`)
          : [this.fallbackImg];
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDHI3EEzM_-s0uuU0xZkLGUfiMhjeelsN8`;
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
      Promise.all(filePromises).then(() => console.log('Tutte le foto nuove selezionate sono pronte'));
    }
  }

  rimuoviFotoPreesistente(index: number) {
    this.annunciService.removePhotoByIndex(this.id, index).subscribe({
      next: () => this.fotoPreesistenti.splice(index, 1),
      error: err => console.error('Errore rimozione foto:', err)
    });
  }

  rimuoviFotoNuova(index: number) {
    this.fotoNuove.splice(index, 1);
  }

  aggiornaTutteLeFoto(): void {
    if (this.fotoNuove.length === 0) return;
    const calls = this.fotoNuove.map(foto => this.annunciService.addPhoto(this.id, foto));
    forkJoin(calls).subscribe({
      next: () => { this.fotoNuove = []; alert('Foto salvate correttamente!'); },
      error: err => console.error('Errore salvataggio foto:', err)
    });
  }

  // --- AGGIORNAMENTO DATI ---
  aggiornaTutto(): void {
    const lat = this.latitudine ?? null;
    const lng = this.longitudine ?? null;
    const previousPrice = this.originalPrezzoNuovo;
    const newPrice = this.annuncio.prezzonuovo;

    const calls = [
      this.annunciService.aggiornaSpecData(this.id, 'titolo', this.annuncio.titolo),
      this.annunciService.aggiornaSpecData(this.id, 'superficie', this.annuncio.superficie),
      this.annunciService.aggiornaSpecData(this.id, 'descrizione', this.annuncio.descrizione),
      this.annunciService.aggiornaSpecData(this.id, 'indirizzo', this.annuncio.indirizzo),
      this.annunciService.aggiornaSpecData(this.id, 'latitudine', lat),
      this.annunciService.aggiornaSpecData(this.id, 'longitudine', lng),
      this.annunciService.aggiornaSpecData(this.id, 'categoria_id', this.selectedCategoryId),
      this.annunciService.aggiornaSpecData(this.id, 'in_vendita', true)
    ];

    if (previousPrice !== null && previousPrice !== newPrice) {
      calls.push(this.annunciService.aggiornaSpecData(this.id, 'prezzo', previousPrice));
      calls.push(this.annunciService.aggiornaSpecData(this.id, 'prezzo_nuovo', newPrice));
    } else {
      calls.push(this.annunciService.aggiornaSpecData(this.id, 'prezzo_nuovo', newPrice));
    }

    forkJoin(calls).subscribe({
      next: () => {
        this.originalPrezzoNuovo = newPrice;
        if (this.fotoNuove.length > 0) this.aggiornaTutteLeFoto();
        else alert('Dati salvati correttamente!');
      },
      error: err => console.error('Errore aggiornamento dati:', err)
    });
  }
}
