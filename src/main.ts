
import { platformBrowser, BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DefaultLogAppender } from './app/shared/logger/log-appender';
import { LogLevel } from './app/shared/logger/log-level';
import { LoggerModule } from './app/shared/logger/logger-module';
import { LayoutModule } from '@angular/cdk/layout';
import { APP_ROUTES } from './app/app.routes';
import { withPreloading, provideRouter, PreloadAllModules } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LegacyInterceptor } from './app/shared/legacy.interceptor';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideLogger } from './app/shared/logger/providers';
import { loggerConfig } from './app/logger.config';
import { withColor } from './app/shared/logger/features';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            LayoutModule,
            MatToolbarModule,
            MatButtonModule,
            MatSidenavModule,
            MatIconModule,
            MatListModule
        ),
        provideLogger(
            loggerConfig,
            withColor()
        ),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LegacyInterceptor,
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideRouter(
            APP_ROUTES,
            withPreloading(PreloadAllModules)
        )
    ]
});