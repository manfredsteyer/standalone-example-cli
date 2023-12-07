import { computed } from "@angular/core";
import { signalStoreFeature, withComputed, withState } from "@ngrx/signals";


export type CallState = 'init' | 'loading' | 'loaded' | { error: string };

export type CallStateSlice = {
    callState: CallState
}

export function withCallState() {
    return signalStoreFeature(
        withState<CallStateSlice>({
            callState: 'init'
        }),
        withComputed((store) => ({
            loading: computed(() => store.callState() === 'loading'),
            loaded: computed(() => store.callState() === 'loaded'),
            error: computed(() => {
                const callState = store.callState();
                if (typeof callState === 'object') {
                    return callState.error;
                }
                return null;
            }),
        }))
    )
}

export function setLoading(): CallStateSlice {
    return { callState: 'loading' };
}

export function setLoaded(): CallStateSlice {
    return { callState: 'loaded' };
}

export function setError(error: string): CallStateSlice {
    return { callState: { error } };
}
