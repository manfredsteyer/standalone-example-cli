import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class InitService {
    constructor() { }

    init(): void {
        console.debug('Initializing stuff ...');
    }
    
}
