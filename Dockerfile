# Stage 1: Build
FROM node:22-slim AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace configuration and package files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY lib/ ./lib/
COPY src/ ./src/
COPY build.mjs tsconfig.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the project
RUN pnpm run build

# Stage 2: Production
FROM node:22-slim

WORKDIR /app

# Copy built files and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
