# Stefania Mastroianni Docker Development Environment

This folder encapsulates a complete, isolated development environment for the project. It includes a MySQL database, a CodeIgniter 4 backend API, a Vite/React frontend, and a Mailpit service for intercepting emails locally.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.

## Starting the Environment

All services are orchestrated by `docker-compose.yml`. You can spin them up in the background by running the following command from this `/docker/dev` directory:

```bash
docker-compose up -d
```

On the first start, Docker will build the custom `backend` and `frontend` images and initialize the MySQL database with the credentials defined in `.env.docker`.

## Accessing the Services

Once the containers are running, you can access the following services locally:

- **Frontend App:** [http://localhost:5173](http://localhost:5173) (Served by Vite, features Hot-Module Reloading)
- **Backend API:** [http://localhost:8080](http://localhost:8080) (CodeIgniter 4 Development Server)
- **Mailpit UI:** [http://localhost:8025](http://localhost:8025) (Web interface to view intercepted development emails)

The MySQL database is exposed on port `3307` locally to avoid conflicts with your system MySQL, but internally all containers communicate on port `3306`.

## Making Code Changes

- **Frontend (`/frontend`):** You can edit your React components as usual. Vite's hot-reloading is enabled because the volume mounts match your local files directly.
- **Backend (`/backend`):** Any PHP changes will be instantly picked up by the CodeIgniter development server because of the volume mount. 

## Stopping the Environment

To shut down the containers safely without deleting the database volume, run:

```bash
docker-compose down
```

### Full Reset (Deleting Database)

If you need to completely nuke the development environment, *including the database data*:

```bash
docker-compose down -v
```
**Warning:** This will erase all localized test data within the Docker Volume. 

## Utilities

### Running Migrations Manually
The backend container runs `php spark migrate` on startup automatically. If you create a new migration and want to run it without restarting:

```bash
docker-compose exec backend php spark migrate
```

### Checking Logs
If a service isn't working, check its logs:
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
```
