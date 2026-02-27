# Coming Soon Page — Deployment Guide

## Overview

This is a standalone Next.js app inside the `coming-soon/` folder. It runs on port **3000** alongside the existing application form app on port **5000**. The existing app is **not affected** by this deployment.

## Prerequisites

- Node.js 18+ installed on the server
- PM2 for process management (`npm install -g pm2`)
- Nginx for reverse proxy
- Certbot for SSL (optional but recommended)

## Deployment Steps

### 1. Pull latest code

```bash
cd /path/to/prime-clinics
git pull origin main
```

### 2. Install dependencies & build

```bash
cd coming-soon
npm install
npm run build
```

### 3. Start with PM2

```bash
# First time
pm2 start npm --name "coming-soon" -- start -- -p 3000
pm2 save

# On subsequent deploys (after git pull + build)
pm2 restart coming-soon
```

### 4. Nginx config

Create a new config file at `/etc/nginx/sites-available/coming-soon`:

```nginx
server {
    listen 80;
    server_name primeclinics.ca www.primeclinics.ca;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

> **Note:** Replace `primeclinics.ca` with whatever domain you want the coming soon page on. The existing `application.primeclinics.ca` nginx config stays untouched.

Enable the config and reload nginx:

```bash
sudo ln -s /etc/nginx/sites-available/coming-soon /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL with Certbot (recommended)

```bash
sudo certbot --nginx -d primeclinics.ca -d www.primeclinics.ca
```

## Redeployment (after code updates)

```bash
cd /path/to/prime-clinics
git pull origin main
cd coming-soon
npm install
npm run build
pm2 restart coming-soon
```

## Useful commands

```bash
pm2 status              # Check if apps are running
pm2 logs coming-soon    # View logs
pm2 restart coming-soon # Restart after deploy
```
