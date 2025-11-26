FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS build
ARG NUXT_UMAMI_WEBSITE_ID
ARG NUXT_UMAMI_HOST
ENV NUXT_UMAMI_WEBSITE_ID=$NUXT_UMAMI_WEBSITE_ID
ENV NUXT_UMAMI_HOST=$NUXT_UMAMI_HOST
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base AS production
COPY --from=build /app/.output /app/.output
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
