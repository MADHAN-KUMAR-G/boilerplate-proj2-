terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# -----------------------------
# Create a Docker network
# -----------------------------
resource "docker_network" "app_network" {
  name = "boiler_network"
}

# -----------------------------
# PostgreSQL Container
# -----------------------------
resource "docker_container" "postgres" {
  name  = "postgres_db"
  image = "postgres:15"

  env = [
    "POSTGRES_DB=boilerdb",
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=postgres"
  ]

  ports {
    internal = 5432
    external = 5432
  }

  # ✅ Absolute host path for Jenkins-safe persistent volume
  volumes {
    host_path      = abspath("${path.module}/pgdata")
    container_path = "/var/lib/postgresql/data"
  }

  networks_advanced {
    name = docker_network.app_network.name
  }
}

# -----------------------------
# Boiler App Container
# -----------------------------
resource "docker_container" "boiler_app" {
  name  = "boiler_app"
  image = "madhan1205/boiler:latest"
  depends_on = [docker_container.postgres]

  ports {
    internal = 3000
    external = 3000
  }

  env = [
    "DB_HOST=postgres_db",
    "DB_USER=postgres",
    "DB_PASSWORD=postgres",
    "DB_NAME=boilerdb",
    "DB_PORT=5432"
  ]

  networks_advanced {
    name = docker_network.app_network.name
  }
}

# -----------------------------
# Outputs
# -----------------------------
output "app_container_name" {
  value = docker_container.boiler_app.name
}

output "postgres_container_name" {
  value = docker_container.postgres.name
}

output "app_url" {
  value = "http://localhost:3000"
}

