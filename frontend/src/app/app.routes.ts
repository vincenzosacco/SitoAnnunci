import {Routes} from "@angular/router";
import {HomeComponent} from "./components/pages/home/home.component";
import {AnnuncioComponent} from './components/api/annuncio/annuncio.component';
import {UserProfileComponent} from './components/pages/user-profile/user-profile.component';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch : 'full' },

  // PAGES
  {path: 'home', component: HomeComponent},
  {path: 'user-profile', component: UserProfileComponent},

  // API
  { path: 'annuncio/:id', component: AnnuncioComponent },

];

