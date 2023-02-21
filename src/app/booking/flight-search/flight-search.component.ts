import { AsyncPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CityValidator } from "@demo/shared";
import { FlightCardComponent } from "../flight-card/flight-card.component";
import { ActivatedRoute } from "@angular/router";
import { FlightSearchFacade } from "./flight-search.facade";

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,
    FormsModule, 
    FlightCardComponent,
    CityValidator,
  ],
  selector: 'flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private facade = inject(FlightSearchFacade)
  
  state = this.facade.state;

  constructor() {

    this.route.paramMap.subscribe(p => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
       
        this.facade.patch({
          from,
          to,
        });

        this.search();
      }
    });
  }

  ngOnInit(): void {
  }

  // Helper function for data binding
  update(key: string, event: any): void {
    this.facade.patch({
      [key]: event.target.value
    });
  }

  // Helper function for data binding
  updateCheckbox(key: string, event: any): void {
    this.facade.patch({
      [key]: event.target.checked
    });
  }

  search(): void {
    if (!this.state().from || !this.state().to) return;
    this.facade.load();
  }

  // Just delay the first flight
  delay(): void {
    this.facade.delay();
  }
}

