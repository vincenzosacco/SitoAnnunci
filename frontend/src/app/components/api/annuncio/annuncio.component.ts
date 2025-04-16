import {Component, inject} from '@angular/core';
import {AnnuncioService} from "../../../services/api/annuncio.service";
import {AnnuncioModel} from "./annuncio.model";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-annuncio',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './annuncio.component.html',
  styleUrl: './annuncio.component.css'
})
export class AnnuncioComponent {
  private annuncioService = inject(AnnuncioService)
  annunci: AnnuncioModel[] = []
  ngOnInit() {
    this.annuncioService.getAll().subscribe({
      next: (data) => {
        this.annunci = data
        // console.log(this.annunci)
      },
      error: (error) => {
        console.error('Errore durante il recupero degli annunci:', error);
      }
    })

  }
}
