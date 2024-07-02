
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
    selector: 'app-flight-edit',
    templateUrl: './flight-edit.component.html',
    standalone: true,
})
export class FlightEditComponent implements OnInit {
  
  id: string | undefined;
  showDetails: string | undefined;
  showWarning = false;

  constructor(@Inject(ActivatedRoute) private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.id = p['id'];
      this.showDetails = p['showDetails'];
    });
  }

}
