# YEDC Academy — Production Deployment Guide

This guide walks you through deploying YEDC Academy to a VPS (Virtual Private Server) with HTTPS.

---

## Prerequisites

| Requirement | Details |
|---|---|
| **VPS** | Ubuntu 22.04+ (DigitalOcean, AWS EC2, Hostinger, etc.) |
| **RAM** | Minimum 2 GB |
| **Domain** | A domain name (e.g., `yedcacademy.com`) pointed to your VPS IP |
| **Docker** | Docker Engine + Docker Compose installed on the VPS |
| **Razorpay** | Live API keys from [Razorpay Dashboard](https://dashboard.razorpay.com) |

---

## Step 1: Set Up the VPS

SSH into your server and install Docker:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt install docker-compose-plugin -y

# Verify
docker --version
docker compose version
```

---

## Step 2: Clone the Repository

```bash
git clone https://github.com/your-username/yedc-academy.git
cd yedc-academy
```

---

## Step 3: Configure Environment Variables

```bash
# Copy the production template
cp .env.production.example .env

# Edit with your real values
nano .env
```

Fill in ALL values:
- **POSTGRES_PASSWORD**: Use a strong random password (32+ characters)
- **JWT_SECRET**: Generate with `openssl rand -hex 32`
- **RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET**: From Razorpay Dashboard → Settings → API Keys
- **DOMAIN**: Your domain (e.g., `yedcacademy.com`)
- **EMAIL**: Your email for Let's Encrypt notifications
- **NEXT_PUBLIC_API_URL**: `https://yourdomain.com/api/v1`

---

## Step 4: Point Your Domain to the VPS

Go to your domain registrar's DNS settings and add:

| Type | Name | Value |
|---|---|---|
| A | @ | `YOUR_VPS_IP_ADDRESS` |
| A | www | `YOUR_VPS_IP_ADDRESS` |

Wait 5–15 minutes for DNS propagation. Verify with:
```bash
ping yourdomain.com
```

---

## Step 5: Deploy

### First-time deployment (with SSL):

```bash
chmod +x deploy.sh

# Step 1: Obtain SSL certificate
./deploy.sh init

# Step 2: Deploy all services
./deploy.sh deploy
```

### Subsequent deployments:

```bash
git pull origin master
./deploy.sh deploy
```

---

## Step 6: Verify

Open `https://yourdomain.com` in your browser. You should see:
- 🔒 HTTPS padlock in the browser
- The YEDC Academy homepage
- Login with your admin credentials

---

## Common Commands

| Command | Description |
|---|---|
| `./deploy.sh deploy` | Build and start all services |
| `./deploy.sh logs` | View live logs from all containers |
| `./deploy.sh stop` | Stop all services |
| `./deploy.sh restart` | Restart all services |
| `./deploy.sh ssl` | Renew SSL certificate |
| `docker logs yedc-backend` | View backend logs only |
| `docker logs yedc-frontend` | View frontend logs only |
| `docker logs yedc-nginx` | View Nginx logs only |

---

## Architecture (Production)

```
                     ┌──────────────┐
    Internet ──────► │    Nginx     │ ◄─── SSL/HTTPS (Let's Encrypt)
                     │  (port 80,   │
                     │   port 443)  │
                     └──────┬───────┘
                            │
                  ┌─────────┴─────────┐
                  │                   │
            /api/* │             /*    │
                  ▼                   ▼
          ┌───────────┐      ┌───────────────┐
          │  Backend   │      │   Frontend    │
          │ Spring Boot│      │   Next.js     │
          │  :8080     │      │   :3000       │
          └─────┬─────┘      └───────────────┘
                │
          ┌─────▼─────┐
          │ PostgreSQL │
          │  :5432     │
          └───────────┘
```

---

## Troubleshooting

### Container not starting?
```bash
docker logs yedc-backend    # Check Java errors
docker logs yedc-frontend   # Check Next.js build errors
docker logs yedc-nginx      # Check Nginx config errors
```

### SSL certificate issues?
```bash
# Re-run certbot manually
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot --webroot-path=/var/www/certbot \
    --email your@email.com --agree-tos --no-eff-email \
    -d yourdomain.com -d www.yourdomain.com
```

### Database connection refused?
```bash
docker logs yedc-db          # Check PostgreSQL logs
docker exec -it yedc-db psql -U yedc_prod_user -d yedc_academy
```
