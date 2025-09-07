import {Routes} from "@angular/router";
import {HomeComponent} from "./components/pages/home/home.component";
import {AnnuncioComponent} from './components/api/annuncio/annuncio.component';
import {UserProfileComponent} from './components/pages/user-profile/user-profile.component';
import {AuthGuard} from './services/auth/auth-guard.service';
import {NoAuthRedirectComponent} from './components/pages/no-auth-redirect/no-auth-redirect.component';
import {ChatComponent} from "./components/pages/chat/chat.component";


export const routes: Routes = [

    // PAGES
    {path: 'home', component: HomeComponent},
    {path: 'no-auth-redirect', component: NoAuthRedirectComponent},
    {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
    {path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
    {path: 'admin',
        loadComponent: () => import('./components/pages/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [AuthGuard],
        data:{roles:['admin']}
    },

    // API
    {path: 'annuncio/:id', component: AnnuncioComponent},

    // WILDCARD (MUST BE THE LAST)
    {path: '**', redirectTo: '/home', pathMatch: 'full'},
];


