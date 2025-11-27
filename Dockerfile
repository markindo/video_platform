# ===========================
# BASE IMAGE (ada ffmpeg!)
# ===========================
FROM node:22-bullseye AS base

# Install ffmpeg & ffprobe (untuk fluent-ffmpeg)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ===========================
# INSTALL DEPENDENCIES
# ===========================
FROM base AS deps

# Salin package.json dan lockfile
COPY package.json package-lock.json* yarn.lock* .npmrc* ./

RUN npm install --legacy-peer-deps

# ===========================
# BUILD APP
# ===========================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma generate
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ===========================
# PRODUCTION IMAGE
# ===========================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy hasil build
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]
