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
  annuncio: AnnuncioModel | undefined;

  ngOnInit() {
    this.annuncioService.getById(1).subscribe((data: AnnuncioModel) => {
      this.annuncio = data;
    });

  }


}
