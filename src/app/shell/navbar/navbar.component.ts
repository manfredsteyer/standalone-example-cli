import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatToolbarModule, MatToolbar } from '@angular/material/toolbar';
import { map, shareReplay } from 'rxjs';
import { MatIconButton } from '@angular/material/button';

@Component({
    selector: 'app-navbar-cmp',
    templateUrl: './navbar.component.html',
    standalone: true,
    imports: [
        MatToolbar,
        NgIf,
        MatIconButton,
        MatIcon,
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
