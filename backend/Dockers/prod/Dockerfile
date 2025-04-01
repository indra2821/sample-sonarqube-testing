# Production Dockerfile for Backend
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy entire project
COPY . .

# Expose production port
EXPOSE 4000

# Ensure production environment
ENV NODE_ENV=production

# Start in production mode
CMD ["node", "index.js"]
