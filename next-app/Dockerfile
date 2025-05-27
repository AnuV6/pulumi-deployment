# Stage 1: Dependencies
FROM node:20.11.1-alpine3.19 AS deps
WORKDIR /app

# Verify Node.js version
RUN node -v && npm -v

# Configure npm
RUN npm config set engine-strict false && \
    npm config set registry https://registry.npmjs.org/

# Copy package files
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:20.11.1-alpine3.19 AS builder
WORKDIR /app

# Verify Node.js version in builder
RUN node -v && npm -v

# Copy package files first for better layer caching
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules

# Copy project files
COPY . .

# Set build-time variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application with standalone output
RUN npm run build

# Stage 3: Runner
FROM node:20.11.1-alpine3.19 AS runner
WORKDIR /app

# Set runtime environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Install only production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next.config.ts ./next.config.ts

# Create non-root user and set permissions
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && chown -R nextjs:nodejs /app \
    && chmod -R 500 /app \
    && chmod -R 400 /app/.next \
    && chmod -R 400 /app/node_modules

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start command
CMD ["node_modules/.bin/next", "start", "-p", "3000"]

