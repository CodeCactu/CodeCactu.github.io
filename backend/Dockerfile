# Etap 1: Instalacja zależności
FROM oven/bun:latest AS base
WORKDIR /usr/src/app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile



FROM oven/bun:latest AS release
WORKDIR /usr/src/app

COPY --from=base /usr/src/app/node_modules ./node_modules
COPY . .

ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["bun", "run", "app.ts"]