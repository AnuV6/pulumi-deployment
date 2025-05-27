# Stage 1: Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --verbose

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy specific directories and files
COPY src ./src
COPY public ./public
COPY next.config.js ./
COPY next.config.ts ./
COPY tsconfig.json ./
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules

# Build the application
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Only copy the necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next.config.ts ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]

