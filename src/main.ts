
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/shared/legacy.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { withPreloading, provideRouter, PreloadAllModules, withComponentInputBinding } from '@angular/router';
import { APP_ROUTES } from './app/app.routes';
import { LayoutModule } from '@angular/cdk/layout';
import { LogLevel } from './app/shared/logger/log-level';
import { DefaultLogAppender } from './app/shared/logger/log-appender';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AppComponent } from './app/app.component';
import { importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideLogger } from './app/shared/logger/providers';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            LayoutModule, 
            MatToolbarModule, 
            MatButtonModule, 
            MatSidenavModule, 
            MatIconModule, 
            MatListModule
        ),

        provideExperimentalZonelessChangeDetection(),

        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
        provideLogger({
            level: LogLevel.DEBUG,
            appenders: [DefaultLogAppender],
            formatter: (level, cat, msg) => [level, cat, msg].join(';'),
        }),
        provideAnimations(),
        provideRouter(
            APP_ROUTES, 
            withPreloading(PreloadAllModules),
            withComponentInputBinding()
        )
    ]
});
