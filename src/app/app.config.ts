import { LayoutModule } from "@angular/cdk/layout";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule, provideClientHydration } from "@angular/platform-browser";
import { provideAnimations, provideNoopAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withPreloading, PreloadAllModules } from "@angular/router";
import { APP_ROUTES } from "./app.routes";
import { loggerConfig } from "./logger.config";
import { authInterceptor } from "./shared/auth.interceptor";
import { withColor } from "./shared/logger/features";
import { provideLogger } from "./shared/logger/providers";

export const appConfig: ApplicationConfig = {
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
        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
        provideAnimations(),
        provideRouter(
            APP_ROUTES,
            withPreloading(PreloadAllModules),
        ), 
        provideClientHydration()
    ]
};
