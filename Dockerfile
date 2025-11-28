# ----------------------------
# Stage 1: Builder
# ----------------------------
FROM node:20-slim AS builder
WORKDIR /app

# Copy package files & install all dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
RUN npm ci

# Copy source code & build
COPY . .
RUN npm run build

# ----------------------------
# Stage 2: Runner (Production)
# ----------------------------
FROM node:20-slim AS runner
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy only build output from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./next.config.ts

# Volume untuk video
VOLUME /app/video-storage

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
