# Development Dockerfile
FROM node:23-alpine AS development

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Install Tailwind CSS and its peer dependencies
RUN npm install -D tailwindcss postcss autoprefixer

# Generate Tailwind config if not exists

# Expose development port
EXPOSE 3002

# Development command
CMD ["npm", "run", "dev"]
