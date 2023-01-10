import { inject, Injectable } from "@angular/core";
import { ColorConfig } from "./color-config";
import { LogLevel } from "./log-level";

export abstract class ColorService {
    abstract apply(level: LogLevel, msg: string): string;
}

@Injectable()
export class DefaultColorService implements ColorService {
    config = inject(ColorConfig);

    apply(level: LogLevel, msg: string): string {
        const key = LogLevel[level].toLowerCase() as keyof ColorConfig;
        const color = this.config[key];
        
        // For the sake of simplicity, we don't use an external 
        // library like chalk here. Instead, we just send a
        // respective escape sequence to the console.
        return `\x1b[${color}m${msg}\x1b[0m`;
    }
}