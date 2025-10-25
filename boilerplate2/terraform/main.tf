terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Docker network
resource "docker_network" "app_network" {
  name = "app_network"

  # Avoid conflict if network already exists
  lifecycle {
    prevent_destroy = false
  }
}

# Docker volume for Postgres data
resource "docker_volume" "pgdata" {
  name = "pgdata"
  # Ensures data persists between container restarts
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
    container_path = "/var/lib/postgresql/data"
    volume_name    = docker_volume.pgdata.name
  }

  restart = "always"
  must_run = true
}

# Node.js Docker image build
resource "docker_image" "node_app_image" {
  name = "node_app:latest"

  build {
    context    = "../"              # root of your repo
    dockerfile = "ci-cd/Dockerfile"
    remove     = true
  }
}

# Node.js container
resource "docker_container" "node_app" {
  name  = "node_app"
  image = docker_image.node_app_image.name

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
  restart = "on-failure"
}

