import { inject, Injectable } from '@angular/core';
import { LOG_APPENDERS } from './log-appender';
import { LogFormatter } from './log-formatter';
import { LogLevel } from './log-level';
import { LoggerConfig } from './logger-config';

@Injectable({providedIn: 'root'})
export class LoggerService {

    private appenders = inject(LOG_APPENDERS);
    private formatter = inject(LogFormatter);
    private config = inject(LoggerConfig);

    log(level: LogLevel, category: string, msg: string): void {
        if (level < this.config.level) {
            return;
        }
        const formatted = this.formatter.format(level, category, msg);
        for (const a of this.appenders) {
            a.append(level, category, formatted);
        }
    }

    error(category: string, msg: string): void {
        this.log(LogLevel.ERROR, category, msg);
    }

    info(category: string, msg: string): void {
        this.log(LogLevel.INFO, category, msg);
    }

    debug(category: string, msg: string): void {
        this.log(LogLevel.DEBUG, category,msg);
    }

}