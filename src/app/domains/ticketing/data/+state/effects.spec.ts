import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';

import {provideMockActions} from '@ngrx/effects/testing';

import {Subject} from 'rxjs';
import {Action} from '@ngrx/store';
import {loadFlights} from './actions';
import {BookingEffects} from './effects';
import {Flight} from '@demo/data';

describe('BookingEffects', () => {
  const actions$ = new Subject<Action>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockActions(() => actions$),
      ],
      imports: [],
    }).compileComponents();

  });

  it('load flights', () => {
    const effects = TestBed.inject(BookingEffects);
    let flights: Flight[] = [];

    effects.loadFlights$.subscribe(action => {
      flights = action.flights;
    });

    actions$.next(loadFlights({ from: 'Paris', to: 'London' }));

    const ctrl = TestBed.inject(HttpTestingController);
    const req = ctrl.expectOne('https://demo.angulararchitects.io/api/flight?from=Paris&to=London');
    req.flush([{}, {}]);

    expect(flights.length).toBe(2);
  });


});
