import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
// oAuth protocol provided by https://auth0.com/.
// https://auth0.com/docs/quickstart/spa/angular/01-login#configure-auth0
import {provideAuth0} from '@auth0/auth0-angular';
import {authInterceptor} from './app/services/auth/auth-facade.service';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(
            // Interceptor to automatically set the Authorization token when making HTTP requests.
            withInterceptors([authInterceptor])
        ),
        provideRouter(routes, withComponentInputBinding()),

        provideAuth0({
            domain: 'dev-t258cewzxm8xksdu.us.auth0.com',
            clientId: 'VXfestcTf7QrwEIHhqCmbjXXQHXPVpQU',
            authorizationParams: {
                redirect_uri: window.location.origin,
                audience: 'http://localhost:8080',
                // The scope defines the permissions that the application is requesting.
                scope: 'openid profile email admin:access read:users',
            }
        })
    ]
}).catch(err => console.error(err));
