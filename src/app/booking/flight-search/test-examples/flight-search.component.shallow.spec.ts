import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Flight } from '@demo/data';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { BookingEffects } from '../+state/effects';
import { bookingFeature } from '../+state/reducers';
import { FlightCardComponent } from '../flight-card/flight-card.component';

import { FlightSearchComponent } from './flight-search.component';

// Shallow Testing
@Component({
  standalone: true,
  selector: 'flight-card',
  template: `<!-- empty template -->`
})
class FlightCardMock {
  @Input() item: Flight | undefined;;
  @Input() selected: boolean | undefined;
  @Output() selectedChange = new EventEmitter<boolean>();
  @Input() showEditButton = true;

  constructor() { }
}

describe('FlightSearchComponent', () => {
  let component: FlightSearchComponent;
  let fixture: ComponentFixture<FlightSearchComponent>;
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        provideRouter([]),
        provideLocationMocks(),

        provideStore(),
        provideState(bookingFeature),
        provideEffects(BookingEffects),
      ],
      imports: [ FlightSearchComponent ]
    })
    .overrideComponent(FlightSearchComponent, {
      remove: { imports: [ FlightCardComponent ] },
      add: { imports: [ FlightCardMock ] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display a flight-card for each found flight', () => {
    component.from = 'Paris';
    component.to = 'London';
    component.search();

    const ctrl = TestBed.inject(HttpTestingController);

    const req = ctrl.expectOne('https://demo.angulararchitects.io/api/flight?from=Paris&to=London');
    req.flush([{}, {}, {}]);

    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('flight-card'));
    expect(cards.length).toBe(3);
  });

});


