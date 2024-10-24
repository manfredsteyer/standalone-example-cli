import { Router, Routes, mapToCanActivate } from "@angular/router";
import AboutComponent from "./about/about.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./shared/auth.guard";
import { AuthService } from "./shared/auth.service";
import { inject } from "@angular/core";


function authGuard() {
    const auth = inject(AuthService).isAuthenticated();
    if (auth) {
        return;
    }
    return inject(Router).createUrlTree(['/home', { needsLogin: true }]);
}

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
        canActivate: [
            () => authGuard()
        ],
        loadChildren: () => import('./booking/flight-booking.routes')
    },
    {
        path: 'about',
        loadComponent: () => import('./about/about.component')
    },
];
