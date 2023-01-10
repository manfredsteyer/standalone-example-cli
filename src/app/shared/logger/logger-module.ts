import { ModuleWithProviders, NgModule } from '@angular/core';
import { defaultConfig } from './logger-config';
import { provideLogger } from './providers';

// NgModule for legacy code
@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [],
})
export class LoggerModule { 

    static forRoot(config = defaultConfig): ModuleWithProviders<LoggerModule> {
        return {
            ngModule: LoggerModule,
            providers: [
                provideLogger(config)
            ]
        };
    }

}
