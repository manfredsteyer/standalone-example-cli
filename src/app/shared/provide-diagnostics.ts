import { EnvironmentProviders, makeEnvironmentProviders, Provider } from "@angular/core";
import { withColor } from "./logger/features";
import { provideLogger } from "./logger/provider";
import { provideTimer } from "./timer/provide";

type InternalEnvironmentProviders = {
    ɵproviders: Provider[];
}

export function combine(ep1: EnvironmentProviders, ep2: EnvironmentProviders): EnvironmentProviders {
    const internal1 = ep1 as unknown as InternalEnvironmentProviders;
    const internal2 = ep2 as unknown as InternalEnvironmentProviders;

    return makeEnvironmentProviders([
        ...internal1.ɵproviders,
        ...internal2.ɵproviders
    ]);
}

export function combineAll(...ep: EnvironmentProviders[]): EnvironmentProviders {
    const internal = ep as unknown as InternalEnvironmentProviders[];

    return makeEnvironmentProviders([
        internal.reduce((acc: Provider[], p: InternalEnvironmentProviders) => ([...acc, p.ɵproviders]), [])
    ]);
}

export function provideDiagnostics(): EnvironmentProviders {
    return combineAll(
        provideLogger({}, withColor()),
        provideTimer()
    );
}
