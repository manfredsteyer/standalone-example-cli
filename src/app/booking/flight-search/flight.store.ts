import { Injectable, computed, inject, signal } from '@angular/core';
import { FlightService, Flight } from '@demo/data';

@Injectable({ providedIn: 'root' })
export class FlightStore {

    private flightService = inject(FlightService);

    from = signal('Hamburg'); // in Germany
    to = signal('Graz'); // in Austria
    
    #flights = signal<Flight[]>([]);
    flights = this.#flights.asReadonly();

    #basket = signal<Record<number, boolean>>({});
    basket = this.#basket.asReadonly();

    selected = computed(() => this.#flights().filter(f => this.#basket()[f.id]));

    search(): void {
        if (!this.from() || !this.to()) return;

        this.flightService
            .find(this.from(), this.to())
            .subscribe((flights) => {
                this.#flights.set(flights);
            });
    }

    updateBasket(flightId: number, selected: boolean): void {
        this.#basket.update(basket => ({
            ...basket,
            [flightId]: selected
        }));
    }

    delay(): void {
        const flights = this.#flights();
        const flight = flights[0];
        const date = new Date(flight.date);

        const newDate = new Date(date.getTime() + 1000 * 60 * 15);
        const newFlight = { ...flight, date: newDate.toISOString() };
        const newFlights = [newFlight, ...flights.slice(1)];

        this.#flights.set(newFlights);
    }
}