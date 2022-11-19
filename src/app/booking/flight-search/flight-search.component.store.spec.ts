import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { FlightSearchComponent } from './flight-search.component';
import { BOOKING_FEATURE_KEY } from '../+state/reducers';

describe('FlightSearchComponent (at store level)', () => {
  let component: FlightSearchComponent;
  let fixture: ComponentFixture<FlightSearchComponent>;

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
            },
          },
        }),
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

});
