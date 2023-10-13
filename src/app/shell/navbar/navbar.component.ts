import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map, shareReplay } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-navbar-cmp',
    templateUrl: './navbar.component.html',
    standalone: true,
    imports: [
        MatToolbarModule,
        NgIf,
        MatButtonModule,
        MatIconModule,
        AsyncPipe,
    ],
})
export class NavbarComponent {
    isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    constructor(
        @Inject(BreakpointObserver) private breakpointObserver: BreakpointObserver) {
    }
}
