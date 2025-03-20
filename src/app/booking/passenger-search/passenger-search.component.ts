import { JsonPipe, NgFor } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { Passenger} from '../../data/passenger';

@Component({
    selector: 'app-passenger-search',
    templateUrl: './passenger-search.component.html',
    standalone: false
})
export class PassengerSearchComponent {
  private http = inject(HttpClient);

  passengers: Passenger[] = [];

  constructor() {
    const url = 'https://demo.angulararchitects.io/api/passenger';
    this.http.get<Passenger[]>(url).subscribe(
      passengers => {
        this.passengers = passengers;
      }
    );
  }

}
