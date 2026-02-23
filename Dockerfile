FROM node:20-bullseye-slim AS base
WORKDIR /app


FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN groupadd -r voicepass && useradd -r -g voicepass voicepass

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER voicepass
EXPOSE 3000

CMD ["node", "server.js"]
