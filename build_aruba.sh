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


echo "Copying Backend..."
mkdir aruba_deploy/api
cp -r backend/app aruba_deploy/api/
cp -r backend/public aruba_deploy/api/
cp -r backend/vendor aruba_deploy/api/
cp -r backend/writable aruba_deploy/api/
        cp backend/spark aruba_deploy/api/ || true
        
        # NOTE: We specifically DO NOT copy the .env file nor generate .htaccess
        # to ensure your live config remains exactly as you manually set it on Aruba.

echo "Done! The aruba_deploy folder is ready to be uploaded via FTP."
