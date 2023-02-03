import { Injectable, InjectionToken } from "@angular/core";
import { LogLevel } from "./log-level";

export abstract class LogFormatter {
    abstract format(level: LogLevel, category: string, msg: string): string;
}

@Injectable()
export class DefaultLogFormatter implements LogFormatter {
    format(level: LogLevel, category: string, msg: string): string {
        const levelString = LogLevel[level].padEnd(5);
        return `[${levelString}] ${category.toUpperCase()} ${msg}`;
    }
}

export const LOG_FORMATTER = new InjectionToken<LogFormatter | LogFormatFn>('LOG_FORMATTER');

export type LogFormatFn = (level: LogLevel, category: string, msg: string) => string;

export const defaultLogFormatFn: LogFormatFn = (level, category, msg) => {
    const levelString = LogLevel[level].padEnd(5);
    return `[${levelString}] ${category.toUpperCase()} ${msg}`;
}
