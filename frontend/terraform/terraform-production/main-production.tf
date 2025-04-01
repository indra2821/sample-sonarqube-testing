terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.0"
    }
  }
}

# Use the Docker provider
provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Build the Docker image for the production environment
resource "docker_image" "frontend_production" {
  name = "frontend-production"
  build {
    path       = "/var/www/eq-aditya-j-mern-stack-internship-2025/frontend"
    dockerfile = "Dockerfile.prod" 
  }
}

# Create Docker container for production
resource "docker_container" "frontend_production_container" {
  name  = "frontend-production-container"
  image = docker_image.frontend_production.latest
  ports {
    internal = 8084  # Port inside the container
    external = 8084  # Port exposed on the host
  }
  restart = "always" # Ensures the container restarts if it fails
}

# Run docker-compose for production
resource "null_resource" "docker_compose_production" {
  provisioner "local-exec" {
    command     = "docker-compose -f /var/www/eq-aditya-j-mern-stack-internship-2025/frontend/docker-compose.prod.yml up --build -d"
    working_dir = "/var/www/eq-aditya-j-mern-stack-internship-2025/frontend"
  }
}

