import { Provider } from "@angular/core";
import { ColorConfig, defaultColorConfig } from "./color-config";
import { ColorService, DefaultColorService } from "./color.service";

export type LoggerFeatureKind = 'COLOR' | 'OTHER-FEATURE';

export interface LoggerFeature {
    kind: LoggerFeatureKind;
    providers: Provider[];
}

export function withColor(config?: Partial<ColorConfig>): LoggerFeature {
    
    const internal = { ...defaultColorConfig, ...config };
    
    return {
        kind: 'COLOR',
        providers: [
            {
                provide: ColorConfig,
                useValue: internal
            },
            {
                provide: ColorService,
                useClass: DefaultColorService,
            }
        ]
    }
}