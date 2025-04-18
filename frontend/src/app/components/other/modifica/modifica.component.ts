import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AnnuncioOld} from "../../pages/home/AnnuncioOld"; // Importa AnnuncioOld

@Component({
  selector: 'app-modifica',
  templateUrl: './modifica.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: []
})
export class ModificaComponent implements OnInit {
  annuncio: AnnuncioOld | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));  // Ottieni l'id dalla rotta
    this.fetchAnnuncioById(id);
  }

  fetchAnnuncioById(id: number): void {
    // Qui dovresti fare una richiesta HTTP per recuperare i dati dell'annuncio con l'id
    // Per ora simulerò il recupero con un oggetto mock
    this.annuncio = new AnnuncioOld(id, 'AnnuncioOld Mock', 'Descrizione Mock', '', 1000, 800, 100, '', false, 'an');
  }
}
