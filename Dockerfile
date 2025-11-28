# ----------------------------
# Stage 1: Builder
# ----------------------------
FROM node:20-slim AS builder
WORKDIR /app

# Copy package files & install ALL dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client (sesuai binary target)
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ----------------------------
# Stage 2: Runner (Production)
# ----------------------------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install ffmpeg + ffprobe
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json untuk install production dependencies
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy build artifacts & prisma schema + client
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy next.config.ts jika digunakan runtime
COPY --from=builder /app/next.config.ts ./next.config.ts

# Volume untuk menyimpan video
VOLUME /app/video-storage

EXPOSE 3000

CMD ["npm", "start"]