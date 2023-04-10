import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { ActivatedRoute } from '@angular/router';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { flatten, nest } from 'src/app/utils';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';

type ComponentState = {
  from: string;
  to: string;
  urgent: boolean;
  flights: Flight[];
  basket: Record<number, boolean>;
};

const initState: ComponentState = {
  from: 'Hamburg',
  to: 'Graz',
  urgent: false,
  flights: [
    {
      id: 1,
      from: 'G',
      to: 'H',
      date: '2022-02-02',
      delayed: false
    }
  ],
  basket: {
    3: true,
    5: true,
  },
};

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
  templateUrl: './flight-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);
  private route = inject(ActivatedRoute);

  state = signal(initState);

  nested = nest(initState);
  flat = flatten(this.nested());

  flatten = flatten;

  constructor() {
    
    const date = this.nested().flights().at(0).date();
    console.log('date', date);

    this.route.paramMap.subscribe((p) => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.state.update((v) => ({
          ...v,
          from,
          to,
        }));

        this.search();
      }
    });
  }

  ngOnInit(): void {}

  // Helper function for data binding
  update(key: string, event: any): void {
    this.state.update((v) => ({
      ...v,
      [key]: event.target.value,
    }));
  }

  // Helper function for data binding
  updateCheckbox(key: string, event: any): void {
    this.state.update((v) => ({
      ...v,
      [key]: event.target.checked,
    }));
  }

  async search() {
    if (!this.state().from || !this.state().to) return;

    const flights = await firstValueFrom(this.flightService.find(
      this.state().from,
      this.state().to,
      this.state().urgent
    ));
    

    const x = nest({flights});
    const y = x().flights();

    this.nested().flights.set(y);

  }

  // Just delay the first flight
  delay(): void {
    // this.state.mutate((s) => {
    //   const flight = s.flights[0];
    //   flight.date = addMinutes(flight.date, 15);
    // });
    this.nested.mutate(s => {
      const flight = s.flights().at(0);
      flight.date.set(addMinutes(flight.date(), 15));
    });
  }
}
