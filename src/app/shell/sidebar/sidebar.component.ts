import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';

@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    constructor(
        @Inject(BreakpointObserver) private breakpointObserver: BreakpointObserver) {
    }
}
