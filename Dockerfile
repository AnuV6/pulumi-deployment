# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only necessary files for dependency installation
COPY next-app/package*.json ./next-app/

# Install dependencies
WORKDIR /app/next-app
RUN npm install --legacy-peer-deps --no-audit --prefer-offline

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/next-app/next.config.js .
COPY --from=builder /app/next-app/package.json ./
COPY --from=builder /app/next-app/public ./public
COPY --from=builder /app/next-app/.next ./.next
COPY --from=builder /app/next-app/node_modules ./node_modules

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
