import { EnvironmentProviders, Provider } from '@angular/core';
import { provideState, provideStore } from '@ngrx/store';
import { BOOKING_FEATURE_KEY, bookingFeature } from '../+state/reducers';
import { provideEffects } from '@ngrx/effects';
import { BookingEffects } from '../+state/effects';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FlightSearchComponent } from './flight-search.component';
import { createFlights } from '@demo/data';
import { TestBed } from '@angular/core/testing';
import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { byPlaceholderText, byRole, byTestId } from 'testing-library-selector';
import { UserEvent } from '@testing-library/user-event/setup/setup';
import { MockComponent } from 'ng-mocks';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { of } from 'rxjs';
import { FlightEditComponent } from '../flight-edit/flight-edit.component';
import { provideMockStore } from '@ngrx/store/testing';

fdescribe('FlightSearch Testing Library', () => {
  const ui = {
    inputFrom: byPlaceholderText<HTMLInputElement>('from'),
    inputTo: byPlaceholderText<HTMLInputElement>('to'),
    btnSubmit: byRole('button', { name: 'Search' }),
    flightCards: byTestId('flight-card'),
  };

  describe('With Search Request', () => {
    type Providers = (
      | EnvironmentProviders
      | Provider[]
      | { provide: unknown; useValue: unknown }
    )[];

    const defaultProviders: Providers = [
      provideStore(),
      provideState(bookingFeature),
      provideEffects(BookingEffects),
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
    ];

    const setup = async (providers: Providers = defaultProviders) => {
      const renderResult = await render(FlightSearchComponent, { providers });
      const user = userEvent.setup();
      const ctrl = TestBed.inject(HttpTestingController);
      const setValue = async (element: Element, value: string) => {
        await user.clear(element);
        await user.type(element, value);
      };

      return { ...renderResult, user, ctrl, setValue };
    };

    it('should render flight cards upon search', async () => {
      const { user, ctrl, setValue } = await setup();

      await setValue(ui.inputFrom.get(), 'Wien');
      await setValue(ui.inputTo.get(), 'Berlin');
      await user.click(ui.btnSubmit.get());
      ctrl
        .expectOne(
          'https://demo.angulararchitects.io/api/flight?from=Wien&to=Berlin'
        )
        .flush(createFlights({}, {}, {}, {}, {}));
      const flightCards = await screen.findAllByTestId('flight-card');
      expect(flightCards).toHaveSize(5);
    });

    it('should search with a mocked flight-card', async () => {
      TestBed.overrideComponent(FlightSearchComponent, {
        add: { imports: [MockComponent(FlightCardComponent)] },
        remove: { imports: [FlightCardComponent] },
      });

      const { user, ctrl, setValue } = await setup();

      await setValue(ui.inputFrom.get(), 'Wien');
      await setValue(ui.inputTo.get(), 'London');
      await user.click(ui.btnSubmit.get());
      ctrl
        .expectOne(
          'https://demo.angulararchitects.io/api/flight?from=Wien&to=London'
        )
        .flush(createFlights({}, {}, {}, {}));
      const flightCards = await screen.findAllByTestId('flight-card');
      expect(flightCards).toHaveSize(4);
    });

    it('should update the input fields and start search, if parameters are passed by route', async () => {
      const paramMap = new Map<string, string>([
        ['from', 'Wien'],
        ['to', 'London'],
      ]);

      const { ctrl } = await setup([
        ...defaultProviders,
        { provide: ActivatedRoute, useValue: { paramMap: of(paramMap) } },
      ]);

      expect(ui.inputFrom.get().value).toBe('Wien');
      expect(ui.inputTo.get().value).toBe('London');

      ctrl.expectOne(
        'https://demo.angulararchitects.io/api/flight?from=Wien&to=London'
      );
    });
  });

  describe('Without Search Request', () => {
    beforeEach(async () =>
      render(FlightSearchComponent, {
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
                flights: createFlights(
                  { id: 1, from: 'Vienna', to: 'London' },
                  {},
                  {}
                ),
              },
            },
          }),
        ],
      })
    );

    it('should render flight-cards immediately if store has flights', async () => {
      const flightCards = await screen.findAllByTestId('flight-card');
      expect(flightCards).toHaveSize(3);
    });

    it('should have flight cards with link to flight edit', async () => {
      const [flightCard] = await screen.findAllByTestId('flight-card');
      const editLink: HTMLLinkElement = within(flightCard).getByText('Edit');
      expect(editLink.href).toBe(
        `${window.origin}/flight-edit/1;showDetails=false`
      );
    });
  });
});
