terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

variable "docker_image" {
  description = "Docker image for Node.js app"
  default     = "madhan1205/boiler:latest"
}

# Create Docker network
resource "docker_network" "app_network" {
  name = "app_network"
}

# PostgreSQL container
resource "docker_container" "postgres" {
  name  = "postgres_db"
  image = "postgres:15"

  env = [
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=postgres",
    "POSTGRES_DB=boilerdb"
  ]

  ports {
    internal = 5432
    external = 5432
  }

  volumes {
    host_path      = "/var/lib/jenkins/workspace/boilerplate2/boilerplate2/terraform/pgdata"
    container_path = "/var/lib/postgresql/data"
  }

  networks_advanced {
    name = docker_network.app_network.name
  }
}

# Node.js App container
resource "docker_container" "node_app" {
  name  = "node_app"
  image = var.docker_image
  ports {
    internal = 3000
    external = 3000
  }

  env = [
    "DB_HOST=postgres_db",
    "DB_USER=postgres",
    "DB_PASS=postgres",
    "DB_NAME=boilerdb",
    "NODE_ENV=development"
  ]

  depends_on = [docker_container.postgres]

  networks_advanced {
    name = docker_network.app_network.name
  }
}

