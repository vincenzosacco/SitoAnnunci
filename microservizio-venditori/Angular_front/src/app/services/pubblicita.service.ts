import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PubblicitaService {
  private readonly baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // Chiedi al backend l'URL di login Mastodon
  getLoginUrl() {
    return this.http.get<{ authUrl: string }>(`${this.baseUrl}/login-url`);
  }

  // Apri popup per login Mastodon
  login() {
    this.getLoginUrl().subscribe(({ authUrl }) => {
      const popup = window.open(authUrl, 'Login Mastodon', 'width=600,height=700');
      if (!popup) {
        alert('Popup bloccato dal browser, permetti l\'apertura delle finestre popup');
      }
      // Non c'è modo semplice di sapere quando il popup si chiude senza backend più complesso,
      // quindi lascia all'utente chiuderlo manualmente.
    });
  }

  pubblicaSuMastodon(annuncio: any) {
    const formData = new FormData();
    formData.append('title', annuncio.nome);
    formData.append('description', annuncio.descrizione);
    if (annuncio.foto) {
      const blob = this.base64ToBlob(annuncio.foto);
      formData.append('image', blob, 'foto.jpg');
    }

    return this.http.post<{ success: boolean, url: string }>(`${this.baseUrl}/post`, formData);
  }

  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], { type: 'image/jpeg' });
  }
}
