import { inject, Injectable } from '@angular/core';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { effect } from 'src/app/signals/effect';
import { signal } from '../../signals';

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
  flights: [],
  basket: {
    3: true,
    5: true,
  },
};

@Injectable({ providedIn: 'root' })
export class FlightSearchFacade {
  private flightService = inject(FlightService);

  state = signal(initState);

  load(): void {
    const flights = this.flightService.findAsSignal(
      this.state().from,
      this.state().to,
      this.state().urgent
    );

    effect(() => {
      this.state.mutate((s) => {
        s.flights = flights();
      });
    });
  }

  delay(): void {
    this.state.mutate((s) => {
      const flight = s.flights[0];
      flight.date = addMinutes(flight.date, 15);
    });
  }
}
