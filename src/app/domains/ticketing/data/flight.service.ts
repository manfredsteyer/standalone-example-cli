import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Flight } from './flight';
import { DataService } from 'src/app/shared/util-common';

export type FlightFilter = {
  from: string;
  to: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService implements DataService<Flight, FlightFilter> {
  baseUrl = `https://demo.angulararchitects.io/api`;

  constructor(private http: HttpClient) {}

  load(filter: FlightFilter): Promise<Flight[]> {
    return this.findPromise(filter.from, filter.to);
  }

  private findPromise(from: string, to: string, urgent = false): Promise<Flight[]> {
    return firstValueFrom(this.find(from, to, urgent));
  }

  private find(
    from: string,
    to: string,
    urgent = false
  ): Observable<Flight[]> {
    // For offline access
    // let url = '/assets/data/data.json';

    // For online access
    let url = [this.baseUrl, 'flight'].join('/');

    if (urgent) {
      url = [this.baseUrl, 'error?code=403'].join('/');
    }

    const params = new HttpParams().set('from', from).set('to', to);

    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, { params, headers });
  }

  public findById(id: string): Observable<Flight> {
    const reqObj = { params: new HttpParams().set('id', id) };
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.get<Flight>(url, reqObj);
  }

  save(flight: Flight): Observable<Flight> {
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.post<Flight>(url, flight);
  }

}
