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

# Define environment-specific configurations
locals {
  # Environment-specific Dockerfile and docker-compose file selection
  dockerfile_frontend = "Dockers/${var.environment}/Dockerfile"
  dockerfile_backend  = "Dockers/${var.environment}/Dockerfile"
  docker_compose_frontend = "docker-compose.${var.environment}.yml"
  docker_compose_backend  = "docker-compose.${var.environment}.yml"
}

# Build frontend Docker image
resource "docker_image" "frontend" {
  name = "frontend-${var.environment}"
  build {
    path       = "/var/www/terraform-docker-project/frontend"
    dockerfile = local.dockerfile_frontend
  }
}

# Build backend Docker image
resource "docker_image" "backend" {
  name = "backend-${var.environment}"
  build {
    path       = "/var/www/terraform-docker-project/backend"
    dockerfile = local.dockerfile_backend
  }
}

# Create frontend Docker container
resource "docker_container" "frontend_container" {
  name  = "frontend-${var.environment}-container"
  image = docker_image.frontend.latest
  ports {
    internal = var.frontend_port
    external = var.frontend_port
  }
}

# Create backend Docker container
resource "docker_container" "backend_container" {
  name  = "backend-${var.environment}-container"
  image = docker_image.backend.latest
  ports {
    internal = var.backend_port
    external = var.backend_port
  }
}

# Optional: Run docker-compose for frontend and backend
resource "null_resource" "docker_compose" {
  provisioner "local-exec" {
    command     = "docker-compose -f /var/www/terraform-docker-project/frontend/${local.docker_compose_frontend} up --build -d"
    working_dir = "/var/www/terraform-docker-project/frontend"
  }
}

resource "null_resource" "docker_compose_backend" {
  provisioner "local-exec" {
    command     = "docker-compose -f /var/www/terraform-docker-project/backend/${local.docker_compose_backend} up --build -d"
    working_dir = "/var/www/terraform-docker-project/backend"
  }
}

