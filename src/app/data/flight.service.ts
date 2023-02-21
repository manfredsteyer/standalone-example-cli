import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Signal } from '../signals';
import { fromObservable } from '../utils';
import { Flight } from './flight';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  baseUrl = `https://demo.angulararchitects.io/api`;

  constructor(private http: HttpClient) {}

  find(
    from: string,
    to: string,
    urgent: boolean = false
  ): Observable<Flight[]> {
    let url = [this.baseUrl, 'flight'].join('/');

    if (urgent) {
      url = [this.baseUrl, 'error?code=403'].join('/');
    }

    const params = new HttpParams().set('from', from).set('to', to);

    const headers = new HttpHeaders().set('Accept', 'application/json');
    const flights$ = this.http.get<Flight[]>(url, { params, headers });

    return flights$;
  
  }

  async findAsPromise(
    from: string,
    to: string,
    urgent: boolean = false
  ): Promise<Flight[]> {
    return await firstValueFrom(this.find(from, to, urgent));
  }

  findAsSignal(
    from: string,
    to: string,
    urgent: boolean = false
  ): Signal<Flight[]> {
    let url = [this.baseUrl, 'flight'].join('/');

    if (urgent) {
      url = [this.baseUrl, 'error?code=403'].join('/');
    }

    const params = new HttpParams().set('from', from).set('to', to);

    const headers = new HttpHeaders().set('Accept', 'application/json');
    const flights$ = this.http.get<Flight[]>(url, { params, headers });

    return fromObservable(flights$, []);
  }
 
}
