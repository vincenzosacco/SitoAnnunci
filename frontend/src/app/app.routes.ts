import {Routes} from "@angular/router";
import {HomeComponent} from "./components/pages/home/home.component";
import {AnnuncioComponent} from './components/api/annuncio/annuncio.component';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch : 'full' },
  // PAGES
  {path: 'home', component: HomeComponent},
  { path: 'annuncio/:id', component: AnnuncioComponent },
  { path: '**', redirectTo: '/home' }

];

