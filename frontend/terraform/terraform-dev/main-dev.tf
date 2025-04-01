terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
      version = "~> 2.0"
    }
  }
}

# Use the correct Docker provider
provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Build the Docker image using Dockerfile.dev
resource "docker_image" "frontend" {
  name = "frontend"
  build {
    path        = "/var/www/eq-aditya-j-mern-stack-internship-2025/frontend"
    dockerfile  = "Dockerfile.dev"
  }
}

# Create Docker container using the built image
resource "docker_container" "frontend_container" {
  name  = "frontend-container"
  image = docker_image.frontend.latest
  ports {
    internal = 5173  # Port inside the container
    external = 5173  # Port exposed on the host
  }
}

# Optional: Run docker-compose for additional orchestration
resource "null_resource" "docker_compose" {
  provisioner "local-exec" {
    command = "sudo docker-compose -f /var/www/eq-aditya-j-mern-stack-internship-2025/frontend/docker-compose.dev.yml up --build -d"
    working_dir = "/var/www/eq-aditya-j-mern-stack-internship-2025/frontend"
  }
}

