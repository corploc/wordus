// Umami analytics — inject the standard tracker from RUNTIME config.
//
// Replaces the nuxt-umami module, which baked host/id into the client bundle at
// build time (env-specific image). Here host + id come from runtimeConfig.public
// (NUXT_PUBLIC_UMAMI_HOST / NUXT_PUBLIC_UMAMI_ID), so the same image works in any
// environment — or with no analytics when the vars are unset.
//
// Universal plugin: useHead renders the <script> server-side into the initial
// HTML head; Umami's script.js auto-tracks page views (incl. SPA navigations).
export default defineNuxtPlugin(() => {
  const umami = useRuntimeConfig().public.umami as
    | { host?: string; id?: string }
    | undefined;

  if (!umami?.host || !umami?.id) return;

  useHead({
    script: [
      {
        src: `${umami.host}/script.js`,
        "data-website-id": umami.id,
        "data-performance": "true",
        defer: true,
      },
    ],
  });
});
