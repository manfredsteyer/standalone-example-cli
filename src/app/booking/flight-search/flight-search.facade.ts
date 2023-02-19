import { inject, Injectable } from '@angular/core';
import { Flight, FlightService } from '@demo/data';
import { signal } from 'src/app/signals';

@Injectable({providedIn: 'root'})
export class FlightSearchFacade {
    constructor() { }

    flightService = inject(FlightService);
    flights = signal<Flight[]>([]);

    async load(from: string, to: string, urgent: boolean) {
        const flights = await this.flightService.findAsPromise(from, to, urgent);
        this.flights.set(flights);
    }
    
}