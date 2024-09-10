FROM node:20-alpine AS base
ENV PNPM_HOME=/usr/bin

RUN npm i -g pnpm@9.9.0

FROM base AS init
WORKDIR /app

COPY . .
RUN pnpm add -g turbo@2.1.1
RUN turbo prune --scope=@numerical/client --docker

FROM base AS installer
WORKDIR /app

COPY --from=init /app/out/json ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=1

COPY --from=installer /app ./
COPY --from=init /app/out/full ./
COPY ./.env ./apps/client/.env
RUN pnpm turbo run build --filter=@numerical/client
RUN rm -rf ./node_modules

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 client

USER root

RUN mkdir -p /app/apps/client/.next/cache
RUN chown -R client:nodejs /app/apps/client/.next/cache

USER client

COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder /app/apps/client/public ./apps/client/public

EXPOSE 3000
CMD ["./apps/client/server.js"]
