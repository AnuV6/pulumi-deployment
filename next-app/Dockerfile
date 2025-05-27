# Use the official Node.js image as base
FROM node:20.11-alpine AS base

# Set working directory 
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Verify that the next binary exists and print its path
RUN ls -la node_modules/.bin/ && \
    which node && \
    echo "NODE_PATH: $NODE_PATH" && \
    npm list -g

# Expose the port the app will run on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Use npm start to ensure proper binary resolution
CMD ["npm", "start"]

