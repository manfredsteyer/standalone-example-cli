import { inject, InjectionToken } from "@angular/core";
import { ColorService } from "./color.service";
import { LogLevel } from "./log-level";

export abstract class LogAppender {
    abstract append(level: LogLevel, category: string, msg: string): void
}

export class DefaultLogAppender implements LogAppender {
    colorService = inject(ColorService, { optional: true });  
    
    append(level: LogLevel, category: string, msg: string): void {
        if (this.colorService) {
            msg = this.colorService.apply(level, msg);
        }
        console.log(msg);
    }
}

export const LOG_APPENDERS = new InjectionToken<LogAppender[]>('LOG_APPENDERS');