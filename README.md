# 📝 Prompt Library

A full-stack application for saving and managing your AI prompts. Built with React, Express.js, PostgreSQL, and Docker.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Express](https://img.shields.io/badge/Express-4-000000)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed)

## ✨ Features

- **Create Prompts**: Add new prompts with a title and content
- **View All Prompts**: See all your saved prompts in a clean grid layout
- **AI Prompt Refinement**: Use LangChain and OpenAI to refine and improve your prompts
- **Side-by-Side Comparison**: Compare original and AI-refined prompts side by side
- **Copy to Clipboard**: One-click copy for any prompt
- **Delete Prompts**: Remove prompts you no longer need
- **Persistent Storage**: All data stored in PostgreSQL database
- **Responsive Design**: Works beautifully on desktop and mobile

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx API Gateway                     │
│                      (Port 8080)                        │
├─────────────────────────────────────────────────────────┤
│                           │                             │
│         /api/*            │           /*                │
│            ▼              │            ▼                │
│    ┌───────────────┐      │    ┌───────────────┐       │
│    │   Express.js  │      │    │    React      │       │
│    │   Backend     │      │    │   Frontend    │       │
│    │  (Port 3001)  │      │    │  (Port 5173)  │       │
│    └───────┬───────┘      │    └───────────────┘       │
│            │              │                             │
│            ▼              │                             │
│    ┌───────────────┐      │                             │
│    │  PostgreSQL   │      │                             │
│    │   Database    │      │                             │
│    │  (Port 5432)  │      │                             │
│    └───────────────┘      │                             │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose installed
- No other services running on ports 8080, 5173, 3001, or 5432
- OpenAI API key (for AI prompt refinement feature)

### Running with Docker

1. **Clone and navigate to the project:**
   ```bash
   cd prompt-manager
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `backend/` directory with your OpenAI API key:
   ```bash
   cd backend
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```
   Replace `your_openai_api_key_here` with your actual OpenAI API key.

3. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - **Main App (via API Gateway)**: http://localhost:8080
   - **Frontend Direct**: http://localhost:5173
   - **Backend API**: http://localhost:3001/api/prompts
   - **Health Check**: http://localhost:3001/health

4. **Stop the services:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove all data:**
   ```bash
   docker-compose down -v
   ```

### Development Mode

For local development without Docker:

#### Backend
```bash
cd backend
npm install
DATABASE_URL=postgres://promptuser:promptpass@localhost:5432/promptdb npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
prompt-manager/
├── docker-compose.yml        # Docker orchestration
├── README.md                 # This file
├── backend/
│   ├── Dockerfile           # Backend container config
│   ├── package.json         # Node.js dependencies
│   └── src/
│       ├── index.js         # Express server entry
│       ├── db/
│       │   ├── index.js     # PostgreSQL connection
│       │   └── init.sql     # Database schema
│       └── routes/
│           └── prompts.js   # API endpoints
├── frontend/
│   ├── Dockerfile           # Frontend container config
│   ├── nginx.conf           # Frontend nginx config
│   ├── package.json         # React dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── index.html           # HTML entry point
│   └── src/
│       ├── main.jsx         # React entry
│       ├── App.jsx          # Main component
│       └── index.css        # Styles
└── nginx/
    └── nginx.conf           # API Gateway config
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/prompts` | Get all prompts |
| GET | `/api/prompts/:id` | Get a single prompt |
| POST | `/api/prompts` | Create a new prompt |
| PUT | `/api/prompts/:id` | Update a prompt |
| DELETE | `/api/prompts/:id` | Delete a prompt |
| POST | `/api/prompts/refine` | Refine a prompt using AI |
| GET | `/health` | Health check endpoint |

### Example API Usage

**Create a prompt:**
```bash
curl -X POST http://localhost:8080/api/prompts \
  -H "Content-Type: application/json" \
  -d '{"title": "My Prompt", "content": "This is my prompt content"}'
```

**Get all prompts:**
```bash
curl http://localhost:8080/api/prompts
```

**Delete a prompt:**
```bash
curl -X DELETE http://localhost:8080/api/prompts/1
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, CSS3
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL 15
- **API Gateway**: Nginx
- **AI/ML**: LangChain, OpenAI API
- **Containerization**: Docker, Docker Compose

## 🤖 AI Prompt Refinement

The application includes an AI-powered prompt refinement feature powered by LangChain and OpenAI:

1. **Generate or edit a prompt** using the Requirements Constructor
2. **Click "Refine with AI"** button in the preview panel
3. **Compare side-by-side** the original and refined versions
4. **Use the refined version** if you prefer it, or continue editing

The refinement process improves:
- Clarity and specificity
- Structure and organization
- Context and detail
- Professional language

**Note**: You need to set up your OpenAI API key in `backend/.env` file for this feature to work.

## 📝 License

MIT License - feel free to use this project for any purpose.




