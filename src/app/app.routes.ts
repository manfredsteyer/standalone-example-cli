import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AuthService } from "./shared/auth.service";

export const APP_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'flight-booking',
        canActivate: [() => inject(AuthService).isAuthenticated()],
        loadChildren: () =>
            import('./booking/flight-booking.routes')
                // .then(m => m.FLIGHT_BOOKING_ROUTES)
    },
    {
        path: 'next-flight',
        loadComponent: () => 
            import('./next-flight/next-flight.component')
                // .then(m => m.NextFlightComponent)
    },
    {
        path: 'about',
        loadComponent: () => 
            import('./about/about.component')
                // .then(m => m.AboutComponent)
    },
];
