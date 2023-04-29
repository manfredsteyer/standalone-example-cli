import { ApplicationConfig } from "@angular/core";
import { LayoutModule } from '@angular/cdk/layout';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { APP_ID, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducer } from './shell/+state/state';
import { APP_ROUTES } from './app.routes';
import { authInterceptor } from './shared/util-auth';
import { provideLogger } from './shared/util-logger';
import { TicketsModule } from './domains/ticketing/feature-my-tickets';
import { loggerConfig } from './logger.config';
import { provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';

// import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
    providers: [
        provideClientHydration(
          // withNoHttpTransferCache()
        ),
    
        // { provide: APP_ID, useValue: 'serverApp' },
    
        provideHttpClient(
          withInterceptors([authInterceptor]),
        ),
    
        provideRouter(
          APP_ROUTES,
          withPreloading(PreloadAllModules),
          withComponentInputBinding(),
        ),
    
        provideLogger(loggerConfig),
    
        provideStore(reducer),
        provideEffects(),
        provideStoreDevtools(),
        provideAnimations(),
    
        importProvidersFrom(TicketsModule),
        importProvidersFrom(LayoutModule),
    ]
}
