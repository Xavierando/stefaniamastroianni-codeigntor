#!/bin/bash
set -e

# Install PHP dependencies if not already installed
if [ ! -d "vendor" ]; then
    echo "Vendor folder not found. Running composer install..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Run database migrations
echo "Running database migrations..."
# Wait for DB to be ready indirectly by retrying migration if it fails connection initially.
# A simpler approach is to loop spark migrate until it succeeds or hits a timeout.
max_retries=30
counter=0
until php spark migrate; do
  counter=$((counter+1))
  if [ $counter -gt $max_retries ]; then
    echo "Database migrations failed after $max_retries attempts."
    exit 1
  fi
  echo "Database not ready yet. Retrying in 2 seconds..."
  sleep 2
done

echo "Database migrated successfully!"

# Start the server
echo "Starting CodeIgniter 4 development server..."
exec php spark serve --host 0.0.0.0 --port 8080
