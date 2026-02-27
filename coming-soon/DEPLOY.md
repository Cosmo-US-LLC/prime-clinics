# Coming Soon Page — Deployment Guide

The coming soon page is a Next.js app in the `coming-soon/` folder. It runs on port **3000** on the same droplet (`142.93.158.21`). The existing application form app on port **5000** is **not affected**.

---

## Team needs to do 3 things:

### Step 1: Deploy the app on the droplet

SSH into the server and run this single block:

```bash
cd /path/to/prime-clinics && \
git pull origin main && \
pm2 restart all && \
cd coming-soon && \
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local && \
npm install && \
npm run build && \
pm2 start npm --name "coming-soon" -- start -- -p 3000 && \
pm2 save
```

That's it for the app. Verify it's running:

```bash
pm2 status
curl http://localhost:3000
```

### Step 2: Add Nginx config on the droplet

```bash
sudo tee /etc/nginx/sites-available/coming-soon > /dev/null << 'NGINX'
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
NGINX

sudo ln -sf /etc/nginx/sites-available/coming-soon /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Step 3: Point DNS in Cloudflare

Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → select **primeclinics.ca** → **DNS** tab.

Add or update these two records:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `142.93.158.21` | Proxied (orange cloud) |
| A | `www` | `142.93.158.21` | Proxied (orange cloud) |

> **Important:** If Cloudflare proxy is on (orange cloud), SSL is handled by Cloudflare automatically — no need for Certbot. Make sure Cloudflare SSL mode is set to **Full** under SSL/TLS → Overview.

---

## Done!

After all 3 steps, `primeclinics.ca` will show the Coming Soon page. `application.primeclinics.ca` continues to work as before.

Email signups are saved to `db/records-coming-soon.json` on the server. To check signups:

```bash
cat /path/to/prime-clinics/db/records-coming-soon.json
```

---

## Future redeployments (after code updates)

```bash
cd /path/to/prime-clinics && git pull origin main && cd coming-soon && npm install && npm run build && pm2 restart coming-soon
```
