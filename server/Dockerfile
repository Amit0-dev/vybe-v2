FROM node:24-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vybe

RUN npx prisma generate

RUN npm run build

FROM node:24-slim AS production

WORKDIR /app

ENV NODE_ENV=production

# Prisma requires OpenSSL
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

CMD ["node", "dist/server.js"]