import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAuth0} from '@auth0/auth0-angular';

import {routes} from './app.routes';
import {environment} from "../environments/environment";
import {provideHttpClient, withFetch} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // provideAuth0(environment.auth0),
    provideHttpClient(
         withFetch(), // Use FetchAPI instead of XMLHttpRequest. More details https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    ),
  ]
};
