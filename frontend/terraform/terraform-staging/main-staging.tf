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

# Build the Docker image for the staging environment
resource "docker_image" "frontend_staging" {
  name = "frontend-staging"
  build {
    path       = "/var/www/eq-aditya-j-mern-stack-internship-2025/frontend"
    dockerfile = "Dockerfile.staging"
  }
}

# Create Docker container for staging
resource "docker_container" "frontend_staging_container" {
  name  = "frontend-staging-container"
  image = docker_image.frontend_staging.latest
  ports {
    internal = 8083  # Port inside the container
    external = 083  # Port exposed on the host
  }
}

# Run docker-compose for staging
resource "null_resource" "docker_compose_staging" {
  provisioner "local-exec" {
    command     = "docker-compose -f /var/www/eq-aditya-j-mern-stack-internship-2025/frontend/docker-compose.staging.yml up --build -d"
    working_dir = "/var/www/eq-aditya-j-mern-stack-internship-2025/frontend"
  }
}

