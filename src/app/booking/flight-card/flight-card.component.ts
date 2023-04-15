import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy, Signal, effect, signal, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CityPipe } from "@demo/shared";
import { Flight, initFlight } from "@demo/data";
import { state } from "src/app/utils";
import { StateService } from "src/app/state.service";

@Component({
  standalone: true,
  selector: 'flight-card',
  imports: [CommonModule, RouterModule, CityPipe],
  templateUrl: './flight-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightCardComponent implements OnChanges {
  
  item = state(initFlight);
  @Input() selected: boolean | undefined;
  @Output() selectedChange = new EventEmitter<boolean>();
  @Input() showEditButton = true;

  stateService = inject(StateService);

  constructor() {
    console.log('state', this.stateService);
    this.item = this.stateService.obj.flights[0];

    const s = (this.item as any).date$signal;

    effect(() => {
      console.log('s', s());
    })

  }

  date(): Signal<string> {
    const s = (this.item as any).date$signal;
    console.log('s', s);

    return s();
  } 

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
  }

  select() {
    this.selected = true;
    this.selectedChange.next(true);
  }

  deselect() {
    this.selected = false;
    this.selectedChange.next(false);
  }

  ping() {
    console.log('ping');
  }
}

