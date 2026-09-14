# Multi-stage Production Dockerfile for StayNest Platform
FROM node:22-alpine AS base

# Install system dependencies if required
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 staynest

COPY --from=base /app/node_modules ./node_modules
COPY . .

USER staynest

EXPOSE 8080

CMD ["node", "app.js"]
