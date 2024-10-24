import { LayoutModule } from "@angular/cdk/layout";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding } from "@angular/router";
import { APP_ROUTES } from "./app.routes";
import { authInterceptor } from "./shared/legacy.interceptor";
import { DefaultLogAppender } from "./shared/logger/log-appender";
import { LogLevel } from "./shared/logger/log-level";
import { provideLogger } from "./shared/logger/providers";
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
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
        ), provideClientHydration()
    ]
};
