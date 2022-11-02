import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withLegacyInterceptors } from '@angular/common/http';
import { enableProdMode, importProvidersFrom, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, RouterModule, withDebugTracing, withPreloading, withRouterConfig } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducer } from './app/+state';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { authInterceptor } from './app/shared/auth.interceptor';
import { LegacyInterceptor } from './app/shared/legacy.interceptor';
import { TicketsModule } from './app/tickets/tickets.module';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withLegacyInterceptors(),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LegacyInterceptor,
      multi: true,
    },
    
    provideRouter(APP_ROUTES, 
      withPreloading(PreloadAllModules),
      withDebugTracing(),
    ),

    provideStore(reducer),
    provideEffects([]),
    provideStoreDevtools(),
    provideAnimations(),

    importProvidersFrom(TicketsModule),
    importProvidersFrom(LayoutModule),
  ]
});
















// {
//   provide: INJECTOR_INITIALIZER,
//   multi: true,
//   useValue: () => inject(InitService).init()
// }