# Development Dockerfile for Backend
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy entire project
COPY . .

# Expose development port
EXPOSE 4000

# Start in development mode with hot-reloading
CMD ["npm", "run", "dev"]
