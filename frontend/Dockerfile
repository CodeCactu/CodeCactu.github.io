FROM oven/bun:alpine AS builder
WORKDIR /app

COPY ./src/ ./src/
COPY ./public/ ./public/
COPY ./next.config.ts ./tsconfig.json ./package.json ./package-lock.json ./.env ./

RUN \
     bun install --frozen-lockfile \
  && bun run build \
  && rm -f ./.env* \
  && mv ./public ./.next/standalone/public \
  && mv ./.next/static ./.next/standalone/.next/static

# RUN \
#      npm ci \
#   && npm i sharp \
#   && bun run build \
#   && rm -f ./.env* \
#   && mv ./public ./.next/standalone/public \
#   && mv ./.next/static ./.next/standalone/.next/static



FROM oven/bun:alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next/standalone ./

# COPY --from=builder /app/node_modules/next/dist/compiled/jest-worker ./node_modules/next/dist/compiled/jest-worker

EXPOSE 3000

CMD ["bun", "run", "server.js"]