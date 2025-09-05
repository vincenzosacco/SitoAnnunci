import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AltraComponent } from './components/altrapagina/altra.component';
import {StatsComponent} from './components/stats/stats.component';
import {AggiungiComponent} from './components/aggiungi/aggiungi.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'Aggiungi', component: AggiungiComponent },
  { path: 'Modifica/:id', component: AltraComponent },
  { path: 'Statistiche', component: StatsComponent },
  { path: '**', redirectTo: '' }
];
