import { Injectable } from "@angular/core";
import { DefaultLogFormatter, LogFormatter } from "./logger/log-formatter";
import { LogLevel } from "./logger/log-level";

@Injectable()
export class CustomFormatter extends DefaultLogFormatter {
    override format(level: LogLevel, categorie: string, msg: string): string {
        const formatted = super.format(level, categorie, msg);
        const date = new Date().toISOString();
        return `<${date}> ${formatted}`;
    }
}
