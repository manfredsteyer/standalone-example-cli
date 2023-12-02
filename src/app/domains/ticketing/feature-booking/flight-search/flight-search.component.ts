import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from 'src/app/shared/util-common';
import { FlightCardComponent } from '../../ui-common';
import { FlightBookingStore, SimpleFlightBookingStore } from '../../data';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,

    FormsModule,
    FlightCardComponent,
    CityValidator,
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent {
  private store = inject(FlightBookingStore);

  from = this.store.flightFilter.from;
  to = this.store.flightFilter.to;
  flights = this.store.flightEntities;
  selected = this.store.selectedFlightEntities;
  selectedIds = this.store.selectedFlightIds;

  canUndo = this.store.canUndo;
  canRedo = this.store.canRedo;

  async search() {
    this.store.loadFlightEntities();
  }

  undo(): void {
    this.store.undo();
  }

  redo(): void {
    this.store.redo();
  }

  updateCriteria(from: string, to: string): void {
    this.store.updateFlightFilter({ from, to });
  }

  updateBasket(id: number, selected: boolean): void {
    this.store.updateSelectedFlightEntities(id, selected);
  }


  // private store = inject(SimpleFlightBookingStore);

  // from = this.store.filter.from;
  // to = this.store.filter.to;
  // flights = this.store.entities;
  // selected = this.store.selectedEntities;
  // selectedIds = this.store.selectedIds;

  // canUndo = this.store.canUndo;
  // canRedo = this.store.canRedo;

  // async search() {
  //   this.store.load();
  // }

  // undo(): void {
  //   this.store.undo();
  // }

  // redo(): void {
  //   this.store.redo();
  // }

  // updateCriteria(from: string, to: string): void {
  //   this.store.updateFilter({ from, to });
  // }

  // updateBasket(id: number, selected: boolean): void {
  //   this.store.updateSelected(id, selected);
  // }

}
