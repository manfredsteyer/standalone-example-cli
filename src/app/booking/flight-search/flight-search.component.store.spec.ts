import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { MockState, MockStore, provideMockStore } from '@ngrx/store/testing';

import { FlightSearchComponent } from './flight-search.component';
import { BOOKING_FEATURE_KEY } from '../+state/reducers';
import { BookingEffects } from '../+state/effects';
import { Flight } from '@demo/data';
import { Subject } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { loadFlights, loadFlightsSuccess } from '../+state/actions';
import { provideMockActions } from '@ngrx/effects/testing';

describe('FlightSearchComponent (at store level)', () => {
  let component: FlightSearchComponent;
  let fixture: ComponentFixture<FlightSearchComponent>;
  let actions$ = new Subject<Action>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        provideRouter([]),
        provideLocationMocks(),

        provideMockStore({
          initialState: {
            [BOOKING_FEATURE_KEY]: {
              flights: [{ id:1 }, { id:2 }, { id:3 }, { id:4 }],
            }
          },
        }),

        provideMockActions(() => actions$),

      ],
      imports: [FlightSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('uses flights from store', () => {
    component.flights$.subscribe((flights) => {
      expect(flights.length).toBe(4);
    });
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
