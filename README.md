# Timologia Oik

On-prem web application for searching and administering vendor data. The frontend is built as static files and served by Nginx inside Docker.

This repository is self-hosted and maintained independently. It talks directly to Supabase from the browser. There is no application server in this repo.

## What the sysadmin needs to know

- Runtime: Docker
- Exposed port: `8088`
- External dependency: Supabase
- Admin login: password-only login, initial password is `admin123`

## Deploy on Ubuntu

Install Docker:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
sudo systemctl enable --now docker
```

Clone the repo:

```bash
git clone <REPO_URL>
cd timologia-oik
```

Build the image:

```bash
sudo docker build -t csv-viewer .
```

Start the container with Compose:

```bash
sudo docker compose up -d
```

Open the app at:

```text
http://SERVER_IP:8088
```

If `ufw` is enabled, allow the port:

```bash
sudo ufw allow 8088/tcp
```

## Daily operations

Check container status:

```bash
sudo docker ps
```

View logs:

```bash
sudo docker logs -f csv-viewer
```

Restart:

```bash
sudo docker compose restart
```

Stop:

```bash
sudo docker compose down
```

## Updating the app

Pull the latest code, rebuild, and restart:

```bash
git pull
sudo docker build -t csv-viewer .
sudo docker compose up -d
```

## Notes

- The Docker image serves static files with Nginx on container port `80`.
- Host port `8088` is defined in [docker-compose.yml](/home/kmh/timologia-oik/docker-compose.yml).
- Supabase URL and public key are currently hardcoded in [client.ts](/home/kmh/timologia-oik/src/integrations/supabase/client.ts).
- The initial admin password is `admin123`. This is hardcoded in the frontend and is not suitable for a real production deployment.
