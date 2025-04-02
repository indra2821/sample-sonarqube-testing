# Define the environment variable
variable "environment" {
  description = "The environment to deploy (dev, staging, prod)"
  type        = string
}

# Define the port variables for frontend and backend
variable "frontend_port" {
  description = "Frontend port"
  type        = number
}

variable "backend_port" {
  description = "Backend port"
  type        = number
}

