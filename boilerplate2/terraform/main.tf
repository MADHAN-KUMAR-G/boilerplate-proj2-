terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# ----------------------------
# Docker Network
# ----------------------------
resource "docker_network" "app_network" {
  name = "app_network"
}

# ----------------------------
# PostgreSQL Container
# ----------------------------
resource "docker_container" "postgres" {
  name  = "postgres_db"
  image = "postgres:15"

  env = [
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=postgres",
    "POSTGRES_DB=mydb"
  ]

  ports {
    internal = 5432
    external = 5432
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  volumes {
    host_path      = "/home/madhan/boilerplate2/terraform/pgdata"
    container_path = "/var/lib/postgresql/data"
  }

  restart = "always" # ensures container restarts if crashes
}

# ----------------------------
# Node.js App Image
# ----------------------------
resource "docker_image" "node_app_image" {
  name = "node_app:latest"

  build {
    context    = "../"             # Terraform folder is /terraform, project root is ../
    dockerfile = "ci-cd/Dockerfile"
    remove     = true               # remove intermediate images after build
  }
}

# ----------------------------
# Node.js App Container
# ----------------------------
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

  restart = "on-failure"  # restarts only if container fails
}

