import { computed } from "@angular/core";
import { signalStoreFeature, withComputed, withState } from "@ngrx/signals";

export type CallState = 'init' | 'loading' | 'loaded' | { error: unknown };

export function withCallState() {
    return signalStoreFeature(
        withState({
            callState: 'init' as CallState
        }),
        withComputed((store) => ({
            loading: computed(() => store.callState() === 'loading'),
            loaded: computed(() => store.callState() === 'loaded')
        }))
    )
}