import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideMockStore, getMockStore } from '@ngrx/store/testing';
import { BookingEffects } from '../+state/effects';
import { bookingFeature } from '../+state/reducers';

import { FlightSearchComponent } from './flight-search.component';

describe('FlightSearchComponent', () => {
  let component: FlightSearchComponent;
  let fixture: ComponentFixture<FlightSearchComponent>;
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        provideStore(),
        provideState(bookingFeature),
        provideEffects(BookingEffects),
      ],
      imports: [ FlightSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should search for flights', () => {

    component.from = 'Paris';
    component.to = 'London';
    component.search();

    const ctrl = TestBed.inject(HttpTestingController);

    ctrl.match(m => {console.log(m.url); return false; });

    const req = ctrl.expectOne('https://demo.angulararchitects.io/api/flight?from=Paris&to=London');
    req.flush([{}, {}, {}]);

  });
});
