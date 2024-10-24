import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-flight-edit',
    templateUrl: './flight-edit.component.html',
    standalone: true,
})
export class FlightEditComponent implements OnInit {
  
  @Input() id: string | undefined;
  @Input() showDetails: string | undefined;
  showWarning = false;

  ngOnInit() {
  }

}
