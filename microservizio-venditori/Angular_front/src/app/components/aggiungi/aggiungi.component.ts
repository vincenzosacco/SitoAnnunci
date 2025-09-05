import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnnunciService } from '../../services/annunci.service';

@Component({
  selector: 'app-aggiungi',
  templateUrl: './aggiungi.component.html',
  styleUrls: ['./aggiungi.component.css'],
  standalone: true,
  imports: [FormsModule, RouterLink]
})
export class AggiungiComponent implements OnInit {
  latitudine: number | null = null;
  longitudine: number | null = null;
  map!: google.maps.Map;
  marker!: google.maps.Marker;
  fotoBase64: string | null = null;

  constructor(private annunciService: AnnunciService) {}

  ngOnInit(): void {
    this.loadGoogleMapsScript()
      .then(() => this.initMap())
      .catch(err => console.error(err));
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google?.maps) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=LA_TUA_API_KEY`;
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
      this.latitudine = event.latLng.lat();
      this.longitudine = event.latLng.lng();

      if (this.marker) this.marker.setMap(null);
      this.marker = new google.maps.Marker({
        position: { lat: this.latitudine, lng: this.longitudine },
        map: this.map
      });
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.convertFileToBase64(file).then(base64 => {
      // Rimuovo eventuale header "data:image/...;base64,"
      const idx = base64.indexOf(',');
      this.fotoBase64 = idx >= 0 ? base64.substring(idx + 1) : base64;
    });
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  async aggiornaTutto(titolo: string, descrizione: string, m2: number, prezzo: number) {
    try {
      const idCasuale = Math.floor(Math.random() * (999999 - 1000 + 1)) + 1000;

      let fotoToSend: string | null = null;
      if (this.fotoBase64) {
        fotoToSend = this.fotoBase64.replace(/\s+/g, '');
      }

      const body = {
        id: idCasuale,
        nome: titolo,
        descrizione,
        m2,
        prezzoVecchio: prezzo,
        prezzoNuovo: prezzo,
        foto: fotoToSend,
        isChanged: true,
        placeId: 'place_11',
        owner: localStorage.getItem("msg"),
        latitudine: this.latitudine,
        longitudine: this.longitudine
      };

      console.log('POST /create body:', body);

      this.annunciService.createAnnuncio(body).subscribe({
        next: res => {
          console.log('Annuncio creato:', res);
          alert('Annuncio salvato con successo!');
        },
        error: err => {
          console.error('Errore durante il salvataggio:', err);
          alert('Errore durante il salvataggio dell\'annuncio. Vedi console.');
        }
      });

    } catch (err) {
      console.error('Errore locale:', err);
      alert('Errore locale durante la preparazione dei dati.');
    }
  }

  protected readonly Number = Number;
}
