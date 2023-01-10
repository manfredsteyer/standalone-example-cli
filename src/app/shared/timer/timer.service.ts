import { Injectable } from '@angular/core';

@Injectable()
export class TimerService {

    private startTime = 0;
    elapsed = 0;

    private now(): number {
        return (new Date()).getTime();
    }

    start(): void {
        this.startTime = this.now();
    }

    stop(): void {
        this.elapsed += this.now() - this.startTime;
    }

    reset(): void {
        this.elapsed = 0;
    }
    
}