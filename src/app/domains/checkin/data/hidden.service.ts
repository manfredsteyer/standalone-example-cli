import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class HiddenService {
    doInternalStuff() {
        return 4711;
    }
}