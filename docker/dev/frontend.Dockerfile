FROM node:20-alpine

# Set working directory
WORKDIR /app

# Since it's a dev environment, we will mount the codebase via volumes.
# The entrypoint/cmd will handle installing dependencies and starting the dev server.
# See docker-compose.yml for the command overrides.

EXPOSE 5173

# Start the dev server globally accessible
CMD ["sh", "-c", "npm install --legacy-peer-deps && npm run dev -- --host"]
