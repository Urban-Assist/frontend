# Stage 1: Build React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve using simple http-server
FROM node:18-alpine
WORKDIR /app

# Install http-server (lightweight alternative to Nginx)
RUN npm install -g http-server

# Copy built app
COPY --from=builder /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080 || exit 1

EXPOSE 8080
CMD ["http-server", "dist", "-p", "8080", "--proxy", "http://localhost:8080?"]