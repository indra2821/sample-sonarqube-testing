# Staging Dockerfile for Backend
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

# Install dependencies
RUN npm install

# Copy entire project
COPY . .

# Expose staging port
EXPOSE 4000

# Override NODE_ENV for staging
ENV NODE_ENV=staging

# Start in staging mode
CMD ["node", "index.js"]
