import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Annuncio } from '../home/Annuncio';
import { AnnunciService } from '../../services/annunci.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements AfterViewInit {
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  annunci: Annuncio[] = [];

  constructor(private annunciService: AnnunciService) {}

  ngAfterViewInit(): void {
    this.annunciService.getAnnunci().subscribe({
      next: (data) => {
        //Filtra solo gli annunci del venditore salvato nel localStorage
        const venditoreId = Number(localStorage.getItem('msg'));
        this.annunci = data
          .map((d: any) => Annuncio.fromJSON(d))
          .filter(a => a.venditoreId === venditoreId);
        this.createChart();
      },
      error: (err) => console.error('Errore caricamento annunci:', err)
    });
  }

  createChart(): void {
    if (!this.annunci || this.annunci.length === 0) return;

    Chart.register(...registerables);

    const labels = this.annunci.map(a => a.titolo);
    const prezzi = this.annunci.map(a => a.prezzoNuovo);

    this.chart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Prezzo Nuovo (€)',
          data: prezzi,
          fill: true,
          borderColor: 'blue',
          backgroundColor: 'rgba(54,162,235,0.2)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true }
        },
        scales: {
          y: { title: { display: true, text: 'Prezzo (€)' } },
          x: { title: { display: true, text: 'Annuncio' } }
        }
      }
    });
  }
}
