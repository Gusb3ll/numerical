FROM node:20-alpine AS base
ENV PNPM_HOME=/usr/bin

RUN npm i -g pnpm@9.9.0

FROM base AS init
WORKDIR /app

COPY . .
RUN pnpm add -g turbo@2.1.1
RUN turbo prune --scope=@numerical/server --docker

FROM base AS installer
WORKDIR /app

COPY --from=init /app/out/json/ .
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

ENV NODE_ENV production
ENV TURBO_TELEMETRY_DISABLED=1

COPY --from=installer /app ./
COPY --from=init /app/out/full/ ./
RUN pnpm turbo run build --filter=@numerical/server
RUN rm -rf ./node_modules
RUN pnpm install --frozen-lockfile --prod

FROM base as runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 server
USER server

COPY --from=builder --chown=server:nodejs /app /app
COPY ./.env ./.env

EXPOSE 4000
CMD ["pnpm", "dotenvx", "run", "--", "node", "./apps/server/dist/main"]
