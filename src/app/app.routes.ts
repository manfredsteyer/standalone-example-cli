import { inject } from "@angular/core";
import { Routes, mapToCanActivate } from "@angular/router";
import { AuthService } from "./shared/util-auth";
import { HomeComponent } from "./shell/home/home.component";
import { AuthGuard } from "./shared/util-auth/auth.guard";

export const APP_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        canActivate: mapToCanActivate([AuthGuard]),
        component: HomeComponent
    },
    {
        path: 'flight-booking',
        canActivate: [() => inject(AuthService).isAuthenticated()],
        loadChildren: () =>
            import('./domains/ticketing/feature-booking')
                .then(m => m.FLIGHT_BOOKING_ROUTES)
    },
    {
        path: 'next-flight',
        loadComponent: () => 
            import('./domains/ticketing/feature-next-flight')
                .then(m => m.NextFlightComponent)
    },
    {
        path: 'checkin',
        loadComponent: () => import('./domains/checkin/feature-manage')
            .then(m => m.FeatureManageComponent)
    },
    {
        path: 'about',
        loadComponent: () => 
            import('./shell/about/about.component')
                // .then(m => m.AboutComponent)
    },
];
