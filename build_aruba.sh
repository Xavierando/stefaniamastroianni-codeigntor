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
        
        echo "Patching Routes for Subfolder Deployment..."
        sed -i "s/\$routes->group('api'/\$routes->group(''/g" aruba_deploy/api/app/Config/Routes.php

        # NOTE: We specifically DO NOT copy the .env file nor generate .htaccess
        # to ensure your live config remains exactly as you manually set it on Aruba.

echo "Done! The aruba_deploy folder is ready to be uploaded via FTP."
echo ""
echo "=================================================================="
echo "ATTENZIONE: dopo l'upload via FTP, PRIMA di considerare il sito"
echo "live, va eseguita la migrazione del database chiamando:"
echo ""
echo "  POST https://<dominio>/api/migrations/run"
echo "  Header: X-Migration-Token: <valore di MIGRATION_TOKEN>"
echo ""
echo "MIGRATION_TOKEN e' definito nel file .env sul server (non nel repo)."
echo "Se la migrazione non viene eseguita, la tabella site_settings non"
echo "esiste: GET /api/settings va in errore 500 e il frontend, per"
echo "design, interpreta questo come impostazioni assenti. Risultato:"
echo "WhatsApp risulta spento su tutto il sito pubblico, senza nessun"
echo "errore visibile ne' in admin ne' per i visitatori."
echo "=================================================================="
