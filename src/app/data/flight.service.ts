import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Flight } from './flight';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  baseUrl = `https://demo.angulararchitects.io/api`;

  constructor(private http: HttpClient) {}

  find(
    from: string,
    to: string,
    urgent: boolean = false
  ): Observable<Flight[]> {

    const date = new Date().toISOString();
    const delayed = false;
    const counter = 1;
    return of([
      { id: 1, from, to, date, delayed, counter},
      { id: 2, from, to, date, delayed, counter},
      { id: 3, from, to, date, delayed, counter},
    ]);
    
    let url = [this.baseUrl, 'flight'].join('/');

    if (urgent) {
      url = [this.baseUrl, 'error?code=403'].join('/');
    }

    const params = new HttpParams().set('from', from).set('to', to);

    const headers = new HttpHeaders().set('Accept', 'application/json');
    const flights$ = this.http.get<Flight[]>(url, { params, headers });

    return flights$;
  }
}
