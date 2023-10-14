import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthService {
    
    userName = 'Max';
    
    isAuthenticated(): boolean {
        if (this.userName) {
            return true;
        }
        return false;
    }

    login(userName: string): void {
        this.userName = userName;
    }

    logout(): void {
        this.userName = '';
    }
}
