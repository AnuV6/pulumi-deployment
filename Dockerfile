# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY next-app/package*.json ./next-app/

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Build Next.js app
WORKDIR /app/next-app
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    mkdir -p /app/next-app/.next && \
    chown -R nextjs:nodejs /app/next-app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/next-app/public /app/next-app/public
COPY --from=builder --chown=nextjs:nodejs /app/next-app/.next /app/next-app/.next
COPY --from=builder --chown=nextjs:nodejs /app/next-app/node_modules /app/next-app/node_modules
COPY --from=builder --chown=nextjs:nodejs /app/next-app/package.json /app/next-app/package.json
COPY --from=builder --chown=nextjs:nodejs /app/next-app/next.config.js /app/next-app/

# Set working directory to next-app
WORKDIR /app/next-app

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
