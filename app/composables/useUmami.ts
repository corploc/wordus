// Typed wrapper around the standard Umami tracker (`window.umami`), which is
// injected at runtime by app/plugins/umami.ts. Gives components a clean,
// auto-imported API for custom events while keeping analytics config 100%
// runtime (no build-time coupling). No-op on the server and when the tracker
// isn't loaded (analytics disabled / not yet ready), so calls are always safe.
declare global {
  interface Window {
    umami?: {
      track: {
        (eventName: string, eventData?: Record<string, unknown>): void;
        (): void;
      };
    };
  }
}

export function useUmami() {
  return {
    /**
     * Track a custom event.
     * @example track("game-created", { language: "fr", players: 4 })
     */
    track(eventName: string, eventData?: Record<string, unknown>) {
      if (import.meta.client) window.umami?.track(eventName, eventData);
    },
  };
}
