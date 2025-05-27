# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy next-app package files
WORKDIR /app/next-app
COPY next-app/package*.json ./

# Install root dependencies
WORKDIR /app
RUN npm install --no-package-lock

# Install next-app dependencies
WORKDIR /app/next-app
RUN npm install --no-package-lock

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy all files
COPY . .

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/next-app/node_modules ./next-app/node_modules

# Build Next.js app
WORKDIR /app/next-app
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/next-app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next-app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/next-app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/next-app/package.json .
COPY --from=builder --chown=nextjs:nodejs /app/next-app/next.config.js .

# Set permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
