import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { Component, inject } from '@angular/core';
import { SidebarComponent } from './shell/sidebar/sidebar.component';
import { NavbarComponent } from './shell/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [SidebarComponent, NavbarComponent, RouterOutlet]
})
export class AppComponent {
  private breakpointObserver = inject<BreakpointObserver>(BreakpointObserver);


  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

}
