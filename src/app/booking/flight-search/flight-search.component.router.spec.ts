import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { Location } from '@angular/common';

import { provideMockStore } from '@ngrx/store/testing';

import { FlightSearchComponent } from './flight-search.component';
import { BOOKING_FEATURE_KEY } from '../+state/reducers';
import { By } from '@angular/platform-browser';
import { FlightEditComponent } from '../flight-edit/flight-edit.component';

describe('FlightSearchComponent (at router level)', () => {
  let component: FlightSearchComponent;
  let fixture: ComponentFixture<FlightSearchComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        provideRouter([
          {
            path: 'flight-edit/:id',
            component: FlightEditComponent
          }
        ]),
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

  it('routes to flight-card', fakeAsync(() => {
  
    const link = fixture.debugElement.query(By.css('a[class*=btn-default ]'))
    link.nativeElement.click();
    
    flush();
    fixture.detectChanges();

    const location = TestBed.inject(Location);
    expect(location.path()).toBe('/flight-edit/1;showDetails=false')
  
  }));

});
