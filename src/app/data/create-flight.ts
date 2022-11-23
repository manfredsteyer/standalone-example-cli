import { Flight } from './flight';

let id = 1;

const defaultFlight: Flight = {
  id: 0,
  from: 'Graz',
  to: 'Hamburg',
  date: '2022-11-23',
  delayed: false,
};

export function createFlight(flight: Partial<Flight>): Flight {
  return { ...defaultFlight, id: ++id, ...flight };
}

export function createFlights(...flights: Partial<Flight>[]) {
  return flights.map(createFlight);
}
