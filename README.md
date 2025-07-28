# Video Rental Management System

A full-stack video rental management system built with .NET 8 Web API backend, React + Vite frontend, and PostgreSQL database.

## 🚀 Quick Start

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project-infosoft
```

## 📊 Database Setup (PostgreSQL with Docker)

### Start PostgreSQL Database

```bash
# Start PostgreSQL and Frontend containers
docker-compose up -d
```

This will start:
- **PostgreSQL** on `localhost:5432`
- **Frontend** on `localhost:3000`

Database credentials:
- **Host**: localhost
- **Port**: 5432
- **Database**: postgres_video-rental
- **Username**: postgres
- **Password**: postgres

## 🗄️ Backend (.NET 8 Web API)

### 1. Install .NET Entity Framework Tools

```bash
# Install EF Core tools globally
dotnet tool install --global dotnet-ef
```

### 2. Database Migrations

```bash
# Navigate to the backend directory (root)
cd project-infosoft

# Create initial migration (if not exists)
dotnet ef migrations add InitialCreate

# Update database with migrations
dotnet ef database update
```

### 3. Run Backend API

```bash
# Run the .NET Web API
dotnet run
```

The backend will be available at:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`
- **Swagger**: `http://localhost:5000/swagger`

## 🎨 Frontend (React + Vite)

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd project-infosoft-frontend

# Install dependencies with pnpm
pnpm install
```

### 2. Run Development Server

```bash
# Start Vite development server
pnpm run dev
```

The frontend will be available at: `http://localhost:5173`

**Note**: The dockerized frontend runs on port 3000, but local development runs on port 5173.

## 🐳 Docker Setup (Alternative)

### Run Everything with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

### Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React + Vite SPA |
| Backend | http://localhost:5000 | .NET Web API |
| PostgreSQL | localhost:5432 | Database |
| Swagger | http://localhost:5000/swagger | API Documentation |

### Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose build --no-cache frontend
docker-compose build --no-cache backend

# Remove volumes (⚠️ deletes database data)
docker-compose down -v
```

## 🔧 Development Workflow

### Recommended Setup

1. **Database**: Run PostgreSQL with Docker
2. **Backend**: Run locally with `dotnet run` (easier debugging)
3. **Frontend**: Run locally with `pnpm run dev` (hot reload)

```bash
# Terminal 1: Start database
docker-compose up postgres -d

# Terminal 2: Run backend
dotnet ef database update
dotnet run

# Terminal 3: Run frontend
cd project-infosoft-frontend
pnpm run dev
```

## 📁 Project Structure

```
project-infosoft/
├── Controllers/                 # Web API Controllers
├── Data/                       # Database Context
├── Models/                     # Entity Models & DTOs
├── Migrations/                 # EF Core Migrations
├── project-infosoft-frontend/  # React Frontend
│   ├── src/
│   │   ├── app/               # API calls & types
│   │   ├── components/        # Reusable components
│   │   ├── routes/           # Page components
│   │   └── lib/              # Utilities
│   ├── package.json
│   └── Dockerfile
├── appsettings.json           # Backend configuration
├── docker-compose.yaml       # Docker services
├── Dockerfile                # Backend Docker image
└── README.md
```

## 🗃️ Database Schema

### Tables

- **Videos**: Video inventory (title, category, price, quantity, rental days)
- **Customers**: Customer information (name, contact details)
- **Rentals**: Rental transactions (customer, video, dates, status)

### Features

- **Rental Management**: Create, track, and return video rentals
- **Inventory Control**: Manage video stock and availability
- **Customer Management**: CRUD operations for customers
- **Reports**: Video inventory and customer rental reports
- **Automatic Due Dates**: Based on video category (VCD: 1 day, DVD: 3 days)

## 🔗 API Endpoints

### Videos
- `GET /api/video` - Get all videos
- `POST /api/video` - Create video
- `PUT /api/video/{id}` - Update video
- `DELETE /api/video/{id}` - Delete video

### Customers
- `GET /api/customer` - Get all customers
- `POST /api/customer` - Create customer
- `PUT /api/customer/{id}` - Update customer
- `DELETE /api/customer/{id}` - Delete customer

### Rentals
- `GET /api/rental` - Get all rentals
- `POST /api/rental` - Create rental
- `PUT /api/rental/return/{id}` - Return rental

### Reports
- `GET /api/reports/video-inventory` - Video inventory report
- `GET /api/reports/customer-rental/{customerId}` - Customer rental report

## 🛠️ Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=postgres_video-rental;Username=postgres;Password=postgres"
  }
}
```

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Migration Issues
```bash
# Remove migrations and recreate
rm -rf Migrations/
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Frontend Build Issues
```bash
# Clear node_modules and reinstall
cd project-infosoft-frontend
rm -rf node_modules .pnpm-store
pnpm install
```

### Docker Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## 📝 Development Notes

- **Backend**: Uses Entity Framework Core with PostgreSQL
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **State Management**: TanStack Query for server state
- **Routing**: TanStack Router
- **UI**: shadcn/ui components
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose

## 🔄 Common Commands

```bash
# Full development setup
docker-compose up postgres -d
dotnet ef database update
dotnet run
# (new terminal)
cd project-infosoft-frontend && pnpm run dev

# Production build
docker-compose up --build

# Database reset
docker-compose down -v
docker-compose up postgres -d
dotnet ef database update

# Frontend production build
cd project-infosoft-frontend
pnpm run build
```

