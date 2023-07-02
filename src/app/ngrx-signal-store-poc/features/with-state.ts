export function withState<State extends Record<string, unknown>>(
  state: State
): () => { state: State } {
  return () => ({ state });
}
