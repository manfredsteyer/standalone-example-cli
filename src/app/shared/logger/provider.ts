import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { LoggerFeature } from "./features";
import { LOG_APPENDERS } from "./log-appender";
import { LogFormatter } from "./log-formatter";
import { defaultConfig, LoggerConfig } from "./logger-config";

export function provideLogger(config?: Partial<LoggerConfig>, ...features: LoggerFeature[]): EnvironmentProviders {
    
    const merged = { ...defaultConfig, ...config};

    const colorFeatures = features?.filter(f => f.kind === 'COLOR')?.length ?? 0;
    
    if (colorFeatures > 1) {
        throw new Error('Only one color feature allowed for logger!');
    }

    return makeEnvironmentProviders([
        {
            provide: LoggerConfig,
            useValue: merged
        },
        {
            provide: LogFormatter,
            useClass: merged.formatter
        },
        merged.appenders.map(a => ({
            provide: LOG_APPENDERS,
            useClass: a,
            multi: true
        })),
        features?.map(f => f.providers)
    ]);
}

