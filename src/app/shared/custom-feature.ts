import { selectSignal, signalStoreFeature, withSignals, withState } from '@nrwl/signals';

export type CallState = 'init' | 'loading' | 'loaded' | { error: any };

export type CallStateSlice = {
    callState: CallState
};

export function callState() {
    return signalStoreFeature(
        withState<CallStateSlice>({
            callState: 'init'
        }),
        withSignals((state) => ({
            loading: selectSignal(() => state.callState() === 'loading')
        }))
    );
}

export function setLoading(): CallStateSlice {
    return { callState: 'loading' };
}

export function setLoaded(): CallStateSlice {
    return { callState: 'loaded' };
}

export function setError(error: any): CallStateSlice {
    return { callState: { error } };
}