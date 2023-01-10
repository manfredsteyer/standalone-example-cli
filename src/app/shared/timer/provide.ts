import { makeEnvironmentProviders } from "@angular/core";
import { TimerService } from "./timer.service";

export function provideTimer() {
    return makeEnvironmentProviders([
       TimerService,
    ]);
}