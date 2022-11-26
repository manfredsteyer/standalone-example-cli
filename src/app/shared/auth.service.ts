import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor() { }
    
    isAuth(): boolean {
        // Just for demo purposes
        return true;
    }
}