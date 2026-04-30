# Build stage
FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:25-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3333
EXPOSE 5001

# Use dumb-init to run the server
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "build/bin/server.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3333', (r) => {if (r.statusCode < 200 || r.statusCode >= 400) throw new Error(String(r.statusCode))})"
