import { FlightSearchComponent } from './flight-search.component';
import { BOOKING_FEATURE_KEY, bookingFeature } from '../+state/reducers';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FlightEditComponent } from '../flight-edit/flight-edit.component';
import { TestBed } from '@angular/core/testing';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { MockComponent } from 'ng-mocks';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { BookingEffects } from '../+state/effects';
import { provideHttpClient } from '@angular/common/http';
import { createFlights } from '@demo/data';
import { of } from 'rxjs';
import { EnvironmentProviders } from '@angular/core';

describe('FlightSearch Cypress Component Testing', () => {
  describe('With Search Request', () => {
    type Provider =
      | EnvironmentProviders
      | { provide: unknown; useValue: unknown };

    const defaultProviders: Provider[] = [
      provideStore(),
      provideState(bookingFeature),
      provideEffects(BookingEffects),
      provideHttpClient(),
      provideRouter([]),
    ];

    const setup = (providers: Provider[] = defaultProviders) => {
      cy.mount(FlightSearchComponent, { providers });
    };

    it('should render flight cards upon search', () => {
      cy.intercept(
        'https://demo.angulararchitects.io/api/flight?from=Wien&to=Berlin',
        { body: createFlights({}, {}, {}, {}, {}) }
      );
      setup();

      cy.get('input[name=from]').clear().type('Wien');
      cy.get('input[name=to]').clear().type('Berlin');
      cy.get('button[type=submit]').click();
      cy.get('flight-card').should('have.length', 5);
    });

    it('should search with a mocked flight-card', () => {
      cy.intercept(
        'https://demo.angulararchitects.io/api/flight?from=Wien&to=London',
        { body: createFlights({}, {}, {}, {}, {}) }
      ).as('searchRequest');
      TestBed.overrideComponent(FlightSearchComponent, {
        add: { imports: [MockComponent(FlightCardComponent)] },
        remove: { imports: [FlightCardComponent] },
      });
      setup();

      cy.get('input[name=from]').clear().type('Wien');
      cy.get('input[name=to]').clear().type('London');
      cy.get('button[type=submit]').click();
      cy.get('flight-card').should('have.length', 5);
      cy.wait('@searchRequest');
    });

    it('should update the input fields and start search, if parameters are passed by route', () => {
      const paramMap = new Map<string, string>([
        ['from', 'Wien'],
        ['to', 'London'],
      ]);

      cy.intercept(
        'https://demo.angulararchitects.io/api/flight?from=Wien&to=London',
        { body: [] }
      ).as('flightSearch');
      setup([
        ...defaultProviders,
        { provide: ActivatedRoute, useValue: { paramMap: of(paramMap) } },
      ]);

      cy.get('input[name=from]').should('have.value', 'Wien');
      cy.get('input[name=to]').should('have.value', 'London');
      cy.wait('@flightSearch');
    });
  });

  describe('Without Search Request', () => {
    beforeEach(() =>
      cy.mount(FlightSearchComponent, {
        providers: [
          provideRouter([
            {
              path: 'flight-edit/:id',
              component: FlightEditComponent,
            },
          ]),
          provideMockStore({
            initialState: {
              [BOOKING_FEATURE_KEY]: {
                flights: createFlights({ id: 1 }, {}, {}),
              },
            },
          }),
        ],
      })
    );

    it('should render flight-cards immediately if store has flights', () => {
      cy.get('flight-card').should('have.length', 3);
    });

    it('should have flight cards with link to flight edit', () => {
      const cypressPath = '/__cypress/src';

      cy.contains('flight-card a', 'Edit').should(
        'have.attr',
        'href',
        `${cypressPath}/flight-edit/1;showDetails=false`
      );
    });
  });
});
