#===========================
# Dockerfile for Nuxt 3 App
#===========================

# Base Stage
FROM node:26-alpine AS base
# Pin pnpm 9 — v10 added strict ignored-builds enforcement that breaks our build
# even with package.json#pnpm.onlyBuiltDependencies. Bump when v10 ergonomics
# stabilize and esbuild + @parcel/watcher are allowlistable cleanly.
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

# Build Stage
FROM base AS build

# No analytics config baked in — Umami host/id are runtime env
# (NUXT_PUBLIC_UMAMI_*), so this image is environment-agnostic.

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Production Stage
FROM base AS production

COPY --from=build /app/.output /app/.output
COPY --from=build /app/server/data /app/server/data

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
