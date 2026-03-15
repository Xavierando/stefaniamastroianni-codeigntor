#!/bin/bash
set -e

echo "Building Frontend..."
cd frontend
npm run build
cd ..

echo "Creating aruba_deploy folder..."
rm -rf aruba_deploy
mkdir aruba_deploy

echo "Copying Frontend..."
cp -r frontend/dist/* aruba_deploy/

echo "Creating Frontend .htaccess..."
cat << 'EOF' > aruba_deploy/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # API requests bypass this rule and go directly to api/ folder
  RewriteCond %{REQUEST_URI} ^/api/ [NC]
  RewriteRule ^ - [L]

  # Map /uploads to /api/public/uploads
  RewriteRule ^uploads/(.*)$ api/public/uploads/$1 [L]

  # React Router fallback
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
EOF

echo "Copying Backend..."
mkdir aruba_deploy/api
cp -r backend/app aruba_deploy/api/
cp -r backend/public aruba_deploy/api/
cp -r backend/vendor aruba_deploy/api/
cp -r backend/writable aruba_deploy/api/
cp backend/spark aruba_deploy/api/
cp backend/.env aruba_deploy/api/

echo "Keeping CodeIgniter Routes for subfolder deployment..."
# The routes should remain in 'api' group because REQUEST_URI is still /api/gallery on Aruba.
echo "Creating Backend routing .htaccess..."
cat << 'EOF' > aruba_deploy/api/.htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/api/public/
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
EOF

echo "Fixing RewriteBase in CodeIgniter public..."
sed -i 's|# RewriteBase /|RewriteBase /api/public/|g' aruba_deploy/api/public/.htaccess

echo "Updating CodeIgniter .env for production..."
sed -i 's/CI_ENVIRONMENT = development/CI_ENVIRONMENT = production/' aruba_deploy/api/.env
sed -i "s|# app.baseURL = ''|app.baseURL = 'https://arpelux.it/'|g" aruba_deploy/api/.env
sed -i "s|# app.indexPage = 'index.php'|app.indexPage = ''|g" aruba_deploy/api/.env
sed -i 's/^ADMIN_USERNAME = .*/ADMIN_USERNAME = "admin"/g' aruba_deploy/api/.env
sed -i 's/^ADMIN_PASSWORD = .*/ADMIN_PASSWORD = "admin"/g' aruba_deploy/api/.env

echo "Setting Database Credentials for Aruba..."
sed -i "s/^database.default.hostname = .*/database.default.hostname = 31.11.38.10/g" aruba_deploy/api/.env
sed -i "s/^database.default.database = .*/database.default.database = Sql1900756_5/g" aruba_deploy/api/.env
sed -i "s/^database.default.username = .*/database.default.username = Sql1900756/g" aruba_deploy/api/.env
sed -i 's/^database.default.password = .*/database.default.password = ""/g' aruba_deploy/api/.env
sed -i "s/^database.default.port = .*/database.default.port = 3306/g" aruba_deploy/api/.env

echo "Done! The aruba_deploy folder is ready to be uploaded via FTP."
