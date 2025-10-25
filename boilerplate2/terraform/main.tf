terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Create a Docker network
resource "docker_network" "app_network" {
  name = "app_network"
}

# Postgres container
resource "docker_container" "postgres" {
  name  = "postgres_db"
  image = "postgres:15"

  ports {
    internal = 5432
    external = 5432
  }

  env = [
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=postgres",
    "POSTGRES_DB=mydb"
  ]

  networks_advanced {
    name = docker_network.app_network.name
  }

  volumes {
    host_path      = "/home/madhan/boilerplate2/terraform/pgdata"
    container_path = "/var/lib/postgresql/data"
  }

  restart = "always"
}

# Node.js app container (pull image from Docker Hub)
resource "docker_container" "node_app" {
  name  = "node_app"
  image = "madhan1205/boiler:latest"  # pull the latest image from Docker Hub

  env = [
    "PORT=3000",
    "DATABASE_URL=postgres://postgres:postgres@postgres_db:5432/mydb"
  ]

  ports {
    internal = 3000
    external = 3000
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  depends_on = [docker_container.postgres]
  restart    = "on-failure"
}

