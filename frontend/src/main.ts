import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
// oAuth protocol provided by https://auth0.com/.
// https://auth0.com/docs/quickstart/spa/angular/01-login#configure-auth0
import { provideAuth0 } from '@auth0/auth0-angular';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),

    provideAuth0({
      domain: 'dev-t258cewzxm8xksdu.us.auth0.com',
      clientId: 'VXfestcTf7QrwEIHhqCmbjXXQHXPVpQU',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  ]
}).catch(err => console.error(err));
