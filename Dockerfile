#===========================
# Dockerfile for Nuxt 3 App
#===========================

# Base Stage
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Build Stage
FROM base AS build

# Set Umami Analytics environment variables
# Needed at build time for Nuxt configuration
ARG NUXT_UMAMI_WEBSITE_ID
ARG NUXT_UMAMI_HOST
ENV NUXT_UMAMI_WEBSITE_ID=$NUXT_UMAMI_WEBSITE_ID
ENV NUXT_UMAMI_HOST=$NUXT_UMAMI_HOST

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
