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

# Create a Docker container
resource "docker_container" "postgres" {
    name  = "postgres_db"
    image = "postgres:latest"
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
}
# Node.js app container
resource "docker_image" "node_app_image" {
  name         = "node_app:latest"
  build {
    context    = "../"              # repo root
    dockerfile = "ci-cd/Dockerfile"
  }
}

resource "docker_container" "node_app" {
  name  = "node_app"
  image = docker_image.node_app_image.latest
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
}
    
