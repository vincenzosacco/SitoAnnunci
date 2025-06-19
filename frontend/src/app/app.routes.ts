import {Routes} from "@angular/router";
import {HomeComponent} from "./components/pages/home/home.component";
import {LoginComponent} from './components/pages/login/login.component';

export const routes: Routes = [
  // { path: '**', redirectTo: '' }, // keep commented to avoid infinite loop #TODO-low resolve this issue
  { path: '', redirectTo: '/home', pathMatch : 'full' },
  // PAGES
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent}

];

