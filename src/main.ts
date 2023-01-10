import { LayoutModule } from '@angular/cdk/layout';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, RouterModule, withDebugTracing, withPreloading, withRouterConfig } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducer } from './app/+state';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { loggerConfig } from './app/logger.config';
import { authInterceptor } from './app/shared/auth.interceptor';
import { LegacyInterceptor } from './app/shared/legacy.interceptor';
import { withColor } from './app/shared/logger/features';
import { DefaultLogAppender } from './app/shared/logger/log-appender';
import { LogLevel } from './app/shared/logger/log-level';
import { provideCategory, provideLogger } from './app/shared/logger/providers';
import { TicketsModule } from './app/tickets/tickets.module';

bootstrapApplication(AppComponent, {
  providers: [
    
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withInterceptorsFromDi(),
    ),
    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LegacyInterceptor,
      multi: true,
    },
    
    provideRouter(APP_ROUTES, 
      withPreloading(PreloadAllModules),
      // withDebugTracing(),
    ),

    provideLogger(loggerConfig,
      withColor({
        debug: 3,
      })
    ),

    // provideCategory('home', DefaultLogAppender),

    
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