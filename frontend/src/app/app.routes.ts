import {Routes} from "@angular/router";
import {HomeComponent} from "./components/pages/home/home.component";
import {AnnuncioComponent} from './components/api/annuncio/annuncio.component';
import {UserProfileComponent} from './components/pages/user-profile/user-profile.component';
import {AuthGuard} from './services/auth-guard.service';
import {NoAuthRedirectComponent} from './components/pages/no-auth-redirect/no-auth-redirect.component';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch : 'full' },

  // PAGES
  {path: 'home', component: HomeComponent},
  {path: 'user-profile', component: UserProfileComponent, canActivate :[AuthGuard]},
  {path: 'no-auth-redirect', component: NoAuthRedirectComponent},

  // API
  { path: 'annuncio/:id', component: AnnuncioComponent },

];

