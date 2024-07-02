import { LayoutModule } from '@angular/cdk/layout';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import AboutComponent from './about/about.component';
import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { HomeComponent } from './home/home.component';
import { LegacyInterceptor } from './shared/legacy.interceptor';
import { NavbarComponent, SidebarComponent } from './shell';
import { LoggerModule } from './shared/logger/logger-module';
import { LogLevel } from './shared/logger/log-level';
import { DefaultLogAppender } from './shared/logger/log-appender';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from './shared/shared.module';

@NgModule({ declarations: [
        AppComponent,
        SidebarComponent,
        NavbarComponent,
        HomeComponent,
        AboutComponent,
    ],
    bootstrap: [
        AppComponent
    ], imports: [BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(APP_ROUTES, {
            preloadingStrategy: PreloadAllModules,
        }),
        LayoutModule,
        LoggerModule.forRoot({
            level: LogLevel.DEBUG,
            appenders: [DefaultLogAppender],
            formatter: (level, cat, msg) => [level, cat, msg].join(';'),
        }),
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        SharedModule], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LegacyInterceptor,
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
