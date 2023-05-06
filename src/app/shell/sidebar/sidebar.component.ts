import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectFlights } from 'src/app/booking/+state/selectors';
import { delayFlight } from 'src/app/booking/+state/actions';

@Component({
    standalone: true,
    selector: 'app-sidebar-cmp',
    imports: [
        RouterModule,
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

    store = inject(Store);
    flights = this.store.selectSignal(selectFlights);
    
    isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    constructor(
        @Inject(BreakpointObserver) private breakpointObserver: BreakpointObserver) {
    }

    delay(): void {
        const flights = this.flights();
        const id = flights[0].id;
        this.store.dispatch(delayFlight({ id }));
    }
}
