#!/bin/bash
# ============================================================
# YEDC Academy - Production Deployment Script
# ============================================================
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh [init|deploy|ssl|logs|stop|restart]
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

ENV_FILE=".env"

log() { echo -e "${GREEN}[YEDC]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ─── Check prerequisites ────────────────────────────────
check_prereqs() {
    command -v docker >/dev/null 2>&1 || error "Docker is not installed."
    command -v docker-compose >/dev/null 2>&1 || command -v docker compose >/dev/null 2>&1 || error "Docker Compose is not installed."
    [ -f "$ENV_FILE" ] || error ".env file not found. Copy .env.production.example to .env and fill in your values."
}

# ─── Load environment ───────────────────────────────────
load_env() {
    export $(grep -v '^#' "$ENV_FILE" | xargs)
    [ -z "$DOMAIN" ] && error "DOMAIN is not set in .env"
    [ -z "$EMAIL" ] && error "EMAIL is not set in .env"
    log "Environment loaded. Domain: $DOMAIN"
}

# ─── Generate Nginx config from template ─────────────────
generate_nginx_conf() {
    log "Generating Nginx config for domain: $DOMAIN"
    envsubst '${DOMAIN}' < nginx/conf.d/default.conf.template > nginx/conf.d/default.conf
    log "Nginx config generated."
}

# ─── Initial SSL Certificate ─────────────────────────────
init_ssl() {
    load_env
    log "Obtaining initial SSL certificate for $DOMAIN..."

    # Create temporary Nginx config for HTTP-only (for certbot challenge)
    mkdir -p nginx/conf.d
    cat > nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'YEDC Academy - Setting up SSL...';
        add_header Content-Type text/plain;
    }
}
EOF

    # Start nginx only
    docker compose -f docker-compose.prod.yml up -d nginx
    sleep 5

    # Request certificate
    docker compose -f docker-compose.prod.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.$DOMAIN"

    # Generate the real config
    generate_nginx_conf

    # Restart nginx with SSL config
    docker compose -f docker-compose.prod.yml restart nginx

    log "SSL certificate obtained and Nginx reconfigured!"
}

# ─── Deploy / Update ─────────────────────────────────────
deploy() {
    load_env
    generate_nginx_conf

    log "Building and starting all services..."
    docker compose -f docker-compose.prod.yml up -d --build

    log "Waiting for services to start..."
    sleep 10

    # Health check
    if docker ps | grep -q "yedc-backend"; then
        log "Backend is running."
    else
        warn "Backend container is not running. Check logs: docker logs yedc-backend"
    fi

    if docker ps | grep -q "yedc-frontend"; then
        log "Frontend is running."
    else
        warn "Frontend container is not running. Check logs: docker logs yedc-frontend"
    fi

    if docker ps | grep -q "yedc-nginx"; then
        log "Nginx is running."
    else
        warn "Nginx is not running. Check logs: docker logs yedc-nginx"
    fi

    echo ""
    log "═══════════════════════════════════════════════"
    log "  YEDC Academy deployed successfully!"
    log "  URL: https://$DOMAIN"
    log "═══════════════════════════════════════════════"
}

# ─── View logs ────────────────────────────────────────────
show_logs() {
    docker compose -f docker-compose.prod.yml logs -f --tail=50
}

# ─── Stop ─────────────────────────────────────────────────
stop() {
    log "Stopping all services..."
    docker compose -f docker-compose.prod.yml down
    log "All services stopped."
}

# ─── Restart ──────────────────────────────────────────────
restart() {
    load_env
    generate_nginx_conf
    log "Restarting all services..."
    docker compose -f docker-compose.prod.yml up -d
    log "All services restarted."
}

# ─── Main ─────────────────────────────────────────────────
check_prereqs

case "${1:-deploy}" in
    init)
        init_ssl
        ;;
    deploy)
        deploy
        ;;
    ssl)
        init_ssl
        ;;
    logs)
        show_logs
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    *)
        echo "Usage: $0 [init|deploy|ssl|logs|stop|restart]"
        echo ""
        echo "  init    - First-time setup: obtain SSL certificate and deploy"
        echo "  deploy  - Build and deploy all services"
        echo "  ssl     - Obtain/renew SSL certificate"
        echo "  logs    - View live logs"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        exit 1
        ;;
esac
