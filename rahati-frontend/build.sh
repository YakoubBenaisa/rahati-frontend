#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting production build process for Rahati Healthcare Platform..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run type checking
echo "🔍 Running type checking..."
npm run typecheck

# Build the application
echo "🏗️ Building the application..."
npm run build

# Optimize images
echo "🖼️ Optimizing images..."
find dist -type f -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.svg" | xargs -P 4 -I {} sh -c 'echo "Optimizing {}..." && npx imagemin {} --out-dir=$(dirname {})'

# Generate service worker
echo "🔧 Generating service worker..."
npx workbox generateSW workbox-config.js

# Create .htaccess for Apache servers
echo "📄 Creating .htaccess for Apache servers..."
cat > dist/.htaccess << EOL
# Enable rewrite engine
RewriteEngine On

# Redirect all requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Set caching headers
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/json "access plus 0 seconds"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
EOL

# Create web.config for IIS servers
echo "📄 Creating web.config for IIS servers..."
cat > dist/web.config << EOL
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" />
    </staticContent>
  </system.webServer>
</configuration>
EOL

# Create nginx.conf example
echo "📄 Creating nginx.conf example..."
mkdir -p deployment
cat > deployment/nginx.conf << EOL
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/rahati-frontend/dist;
    index index.html;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOL

# Create deployment README
echo "📄 Creating deployment README..."
cat > deployment/README.md << EOL
# Rahati Healthcare Platform Deployment

This directory contains configuration files for deploying the Rahati Healthcare Platform to various environments.

## Deployment Options

### 1. Static Hosting (Recommended for Frontend)

The built application in the \`dist\` directory can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

### 2. Traditional Web Servers

Configuration files are provided for:

- Apache (.htaccess in dist directory)
- Nginx (nginx.conf in this directory)
- IIS (web.config in dist directory)

## Environment Variables

Make sure to set the following environment variables for production:

\`\`\`
VITE_API_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
\`\`\`

## Deployment Checklist

- [ ] Set correct API URL in environment variables
- [ ] Configure proper SSL/TLS certificates
- [ ] Set up proper caching headers
- [ ] Configure CDN if needed
- [ ] Set up monitoring and error tracking
- [ ] Test the deployed application thoroughly
EOL

# Create workbox-config.js for service worker
echo "📄 Creating workbox-config.js for service worker..."
cat > workbox-config.js << EOL
module.exports = {
  globDirectory: "dist/",
  globPatterns: [
    "**/*.{html,js,css,png,jpg,jpeg,svg,ico,json}"
  ],
  swDest: "dist/service-worker.js",
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        }
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "google-fonts-stylesheets"
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    }
  ]
};
EOL

# Make the build script executable
chmod +x build.sh

echo "✅ Production build process completed successfully!"
echo "📁 The optimized build is available in the 'dist' directory."
echo "📝 Deployment configurations are available in the 'deployment' directory."
