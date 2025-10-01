# Gunakan Bun sebagai base image
FROM oven/bun:1 AS base

WORKDIR /app

# Install OpenSSL + CA certificates biar SSL trusted
RUN apt-get update -y \
  && apt-get install -y openssl ca-certificates curl \
  && update-ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Salin file dependency
COPY bun.lock package.json ./

# Install dependency
RUN bun install --frozen-lockfile

# Salin semua kode project
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Build Next.js
RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
