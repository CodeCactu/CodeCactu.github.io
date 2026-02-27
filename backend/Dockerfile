# Etap 1: Instalacja zależności
FROM oven/bun:latest AS base
WORKDIR /usr/src/app

COPY package.json bun.lockb tsconfig.json ./

RUN bun install --frozen-lockfile

COPY app.ts ./
COPY src ./src



FROM oven/bun:latest AS release
WORKDIR /usr/src/app

COPY --from=base /usr/src/app/ ./

ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["bun", "run", "app.ts"]