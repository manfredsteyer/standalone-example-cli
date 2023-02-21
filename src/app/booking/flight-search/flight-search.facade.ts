import { inject, Injectable } from '@angular/core';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { Signal, signal } from '../../signals';

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

  #state = signal(initState);
  readonly state = this.#state as Signal<ComponentState>; // Not writeable anymore

  async load(): Promise<void> {
    const flights = await this.flightService.findAsPromise(
      this.#state().from,
      this.#state().to,
      this.#state().urgent
    );

      this.#state.mutate((s) => {
        s.flights = flights;
      });
  }

  patch(state: Partial<ComponentState>): void {
    // Validate incoming state here
    this.#state.update(s => ({ ...s, ...state }));
  }

  delay(): void {
    this.#state.mutate((s) => {
      const flight = s.flights[0];
      flight.date = addMinutes(flight.date, 15);
    });
  }
}
