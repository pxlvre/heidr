# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy dependencies and built code from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/cli ./cli
COPY --from=builder /app/config ./config
COPY --from=builder /app/errors ./errors
COPY --from=builder /app/providers ./providers
COPY --from=builder /app/services ./services
COPY --from=builder /app/types ./types
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/tsconfig.json ./

# Make CLI executable
RUN chmod +x /app/cli/index.ts

# Set entrypoint to heidr CLI
ENTRYPOINT ["bun", "run", "/app/cli/index.ts"]

# Default command (show help)
CMD ["--help"]
