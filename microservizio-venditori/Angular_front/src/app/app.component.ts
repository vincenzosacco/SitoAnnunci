import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {ChatbotComponent} from './components/chatbot/chatbot.component';

export class Annuncio {
  constructor(
    public id: number,
    public nome: string,
    public descrizione: string,
    public foto: string,
    public prezzoVecchio: number,
    public prezzoNuovo: number,
    public m2: number,
    public placeId: string,
    public changed: boolean,
    public owner: string
  ) {}

  static fromJSON(data: any): Annuncio {
    return new Annuncio(data.id, data.nome, data.descrizione, data.foto, data.prezzoVecchio, data.prezzoNuovo, data.m2, data.placeId, data.changed, data.owner);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ChatbotComponent],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = "I miei annunci";
  annunci: Annuncio[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAnnunci();
  }

  fetchAnnunci(): void {
    const apiUrl = 'http://localhost:8081/api/data';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (response: any[]) => {
        console.log('Dati ricevuti:', response); // Log per controllare i dati ricevuti
        this.annunci = response.map(data => Annuncio.fromJSON(data));
      },
      error: (error: any) => {
        console.error('Errore nel caricamento degli annunci', error);
      },
      complete: () => {
        console.log('Richiesta completata');
      }
    });
  }
}
