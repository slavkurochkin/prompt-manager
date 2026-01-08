# 📝 Prompt Manager

A comprehensive full-stack application for managing AI prompts, building requirements, and organizing research notes. Built with React, Express.js, PostgreSQL, and Docker.

## 🎥 Video Walkthrough

**Watch the full walkthrough:** [https://youtu.be/10RZIlMgyMk](https://youtu.be/10RZIlMgyMk)

This video demonstrates all features including the Prompt Library, Requirements Constructor, and Notes system.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Express](https://img.shields.io/badge/Express-4-000000)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed)
![LangChain](https://img.shields.io/badge/LangChain-OpenAI-FF6B6B)

---

## ✨ Features

### 📚 Prompt Library

**Core Functionality:**
- **Create & Manage Prompts**: Save prompts with titles, content, model information, and metadata
- **Edit Prompts**: Full CRUD operations with inline editing
- **Token Counting**: Real-time token count using GPT tokenizer (supports up to 4000+ tokens)
- **Prompt Confidence Analyzer**: AI-powered quality scoring based on prompt engineering best practices
  - Analyzes length, structure, specificity, examples, role/persona, chain-of-thought indicators
  - Includes EmotionPrompt detection (based on [EmotionPrompt research](https://arxiv.org/pdf/2307.11760))
  - Visual confidence badges with detailed breakdown popovers
- **Star Ratings**: 1-5 star rating system for prompt quality
- **Notes**: Add contextual notes to each prompt
- **Tags System**: Organize prompts with tags and filter by multiple tags
- **Copy to Clipboard**: One-click copy for any prompt content
- **Export Options**: Export your entire prompt library to CSV or PDF
- **Prompt Techniques Guide**: Built-in examples for 8+ prompt engineering techniques:
  - Chain of Thought (CoT)
  - Few-Shot Learning
  - Role Playing
  - Zero-Shot
  - Structured Output
  - Constraints & Guardrails
  - Iterative Refinement
  - Socratic Method

**AI Features:**
- **AI Prompt Refinement**: Use LangChain and OpenAI GPT-4o-mini to refine and improve prompts
- **Side-by-Side Comparison**: Compare original and AI-refined prompts
- **Smart Suggestions**: Get AI-powered improvements for clarity, structure, and effectiveness

### 🏗️ Requirements Constructor

A comprehensive tool for building detailed requirements for AI-powered web applications:

**System Prompts:**
- Define custom system prompts for AI interactions
- Multiple system prompt support

**Technical Architecture Builder:**
- **Frontend Frameworks**: React, Vue, Next.js, Nuxt.js, Svelte, Angular, Remix, Astro, Solid.js
- **Backend Frameworks**: Node.js/Express, FastAPI, Django, Flask, NestJS, Fastify, Koa, Hapi, Spring Boot, ASP.NET Core
- **Service Types**: Monolith, Microservices, Serverless, SOA, Modular Monolith, Event-Driven, Layered, Hexagonal, Clean Architecture
- **Databases**: PostgreSQL, MySQL, MongoDB, Redis, SQLite, MariaDB, Cassandra, DynamoDB, Elasticsearch, Neo4j
- **Database Migrations**: Alembic, Django Migrations, Flask-Migrate, TypeORM, Prisma, Sequelize, Knex.js, Flyway, Liquibase
- **Authentication Methods**: JWT, OAuth 2.0, OIDC, Session-based, API Keys, Basic Auth, Bearer Token, HMAC, SAML, LDAP, Active Directory
- **Authorization Levels**: Public, Authenticated, User, Admin, Super Admin, Moderator, Guest, Read-only, Write, Owner
- **Messaging Systems**: RabbitMQ, Apache Kafka, Redis Pub/Sub, Amazon SQS/SNS, Azure Service Bus, Google Pub/Sub, NATS, Apache Pulsar
- **Caching Strategies**: In-memory, Distributed, Cache-aside, Write-through, Write-behind, TTL-based, LRU eviction
- **API Gateways**: Kong, AWS API Gateway, Azure API Management, Nginx, Traefik, Envoy
- **Testing Frameworks**: Jest, Vitest, Pytest, Mocha, Chai, Cypress, Playwright, Selenium
- **API Testing Tools**: Axios, cURL, Postman, Insomnia, Supertest, REST Assured, Newman, Karate
- **Observability**: Logging, Monitoring, Tracing, Metrics, Alerting, APM, Error Tracking
- **Security**: HTTPS/TLS, CORS, CSP, Input Validation, SQL Injection Prevention, XSS Protection, CSRF Protection, Rate Limiting
- **Failure Handling**: Retry Logic, Circuit Breaker, Timeout Handling, Graceful Degradation, Fallback Mechanisms
- **Testing Philosophy**: TDD, BDD, Integration Testing, E2E Testing, Unit Testing, Performance Testing
- **Model Validation**: Input Validation, Output Validation, Schema Validation, Data Sanitization

**Design & UI:**
- **Design Styles**: Material Design, Flat Design, Neumorphism, Glassmorphism, Skeuomorphism, Minimalist, Bold, Playful
- **Icon Libraries**: Font Awesome, Material Icons, Heroicons, Feather Icons, React Icons, Lucide, Phosphor Icons
- **UI Frameworks**: Material-UI, Ant Design, Chakra UI, Tailwind CSS, Bootstrap, Bulma, Semantic UI
- **Chart Libraries**: Chart.js, D3.js, Recharts, Victory, Plotly, ApexCharts, Nivo

**Product Requirements:**
- Product Requirements Document (PRD) builder
- User Stories generator
- Acceptance Criteria definition
- Non-Functional Requirements
- Business Rules specification
- Additional Requirements section

**Features:**
- **Framework Compatibility**: Smart suggestions based on selected frameworks
- **Real-time Preview**: See your generated prompt as you build
- **Load Existing Prompts**: Load saved prompts into the constructor for editing
- **AI Refinement**: Refine generated prompts with AI
- **Save/Update**: Save new prompts or update existing ones
- **Collapsible Sections**: Organize your requirements with expandable sections

### 📝 Research Notes

A note-taking system inspired by Apple Notes:

**Core Features:**
- **Create & Edit Notes**: Rich text notes with auto-save (debounced)
- **Color Coding**: 6 color themes (Default, Amber, Emerald, Sky, Violet, Rose)
- **Pin/Unpin**: Pin important notes to the top
- **Search**: Full-text search across all notes
- **Preview Mode**: Read-only preview mode for clean viewing
- **Link Support**: 
  - Insert markdown links: `[Link text](https://example.com)`
  - Plain URLs automatically become clickable
  - External link indicators
- **Folder Organization**: Organize notes into folders (database support)
- **Auto-save**: Changes saved automatically with 800ms debounce
- **Timestamps**: Created and updated timestamps with relative time display
- **Responsive Design**: Works beautifully on all screen sizes

---

## 🏗️ Technical Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx API Gateway                     │
│                      (Port 8080)                         │
│              Routes /api/* to backend                     │
│              Routes /* to frontend                        │
├─────────────────────────────────────────────────────────┤
│                           │                             │
│         /api/*            │           /*                │
│            ▼              │            ▼                │
│    ┌───────────────┐      │    ┌───────────────┐       │
│    │   Express.js  │      │    │    React      │       │
│    │   Backend     │      │    │   Frontend    │       │
│    │  (Port 3001)  │      │    │  (Port 5173)  │       │
│    │               │      │    │   (Vite)      │       │
│    │  - REST API   │      │    │               │       │
│    │  - Validation │      │    │  - React 18   │       │
│    │  - LangChain  │      │    │  - Vite       │       │
│    │  - OpenAI     │      │    │  - CSS3       │       │
│    └───────┬───────┘      │    └───────────────┘       │
│            │              │                             │
│            ▼              │                             │
│    ┌───────────────┐      │                             │
│    │  PostgreSQL   │      │                             │
│    │   Database    │      │                             │
│    │  (Port 5432)  │      │                             │
│    │               │      │                             │
│    │  - prompts    │      │                             │
│    │  - notes      │      │                             │
│    │  - indexes    │      │                             │
│    └───────────────┘      │                             │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- **React 18**: Modern UI library with hooks
- **Vite**: Fast build tool and dev server
- **CSS3**: Custom styling with CSS variables
- **gpt-tokenizer**: Token counting for prompts
- **jsPDF**: PDF export functionality
- **Lucide React**: Icon library

**Backend:**
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **PostgreSQL 15**: Relational database
- **LangChain**: AI/ML framework
- **OpenAI API**: GPT-4o-mini for prompt refinement
- **Joi**: Input validation

**Infrastructure:**
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: API Gateway and reverse proxy
- **PostgreSQL**: Persistent data storage

### Database Schema

**Prompts Table:**
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR(255))
- content (TEXT)
- model (VARCHAR(100))
- token_count (INTEGER)
- rating (INTEGER, 0-5)
- note (TEXT)
- tags (TEXT[])
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Notes Table:**
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR(255))
- content (TEXT)
- color (VARCHAR(20))
- is_pinned (BOOLEAN)
- folder (VARCHAR(100))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Indexes:**
- `idx_prompts_created_at` on `prompts(created_at DESC)`
- `idx_prompts_tags` (GIN index) on `prompts(tags)`
- `idx_notes_created_at` on `notes(created_at DESC)`
- `idx_notes_is_pinned` on `notes(is_pinned DESC)`
- `idx_notes_folder` on `notes(folder)`

---

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose installed
- No other services running on ports 8080, 5173, 3001, or 5433
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

4. **Access the application:**
   - **Main App (via API Gateway)**: http://localhost:8080
   - **Frontend Direct**: http://localhost:5173
   - **Backend API**: http://localhost:3001/api/prompts
   - **Health Check**: http://localhost:3001/health

5. **Stop the services:**
   ```bash
   docker-compose down
   ```

6. **Stop and remove all data:**
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

---

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
│       ├── routes/
│       │   ├── prompts.js   # Prompt API endpoints
│       │   └── notes.js     # Notes API endpoints
│       ├── services/
│       │   └── promptRefinement.js  # AI refinement service
│       └── validations/
│           ├── validate.js           # Validation middleware
│           ├── promptValidation.js   # Prompt schemas
│           └── noteValidation.js     # Note schemas
├── frontend/
│   ├── Dockerfile           # Frontend container config
│   ├── nginx.conf           # Frontend nginx config
│   ├── package.json         # React dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── index.html           # HTML entry point
│   └── src/
│       ├── main.jsx         # React entry
│       ├── App.jsx          # Main Prompt Library component
│       ├── Notes.jsx        # Notes component
│       ├── RequirementsConstructor.jsx  # Requirements builder
│       └── index.css        # Styles
└── nginx/
    └── nginx.conf           # API Gateway config
```

---

## 🔌 API Endpoints

### Prompts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/prompts` | Get all prompts |
| GET | `/api/prompts/:id` | Get a single prompt |
| POST | `/api/prompts` | Create a new prompt |
| PUT | `/api/prompts/:id` | Update a prompt |
| DELETE | `/api/prompts/:id` | Delete a prompt |
| PATCH | `/api/prompts/:id/rating` | Update prompt rating |
| PATCH | `/api/prompts/:id/note` | Update prompt note |
| PATCH | `/api/prompts/:id/tags` | Update prompt tags |
| POST | `/api/prompts/refine` | Refine a prompt using AI |

### Notes API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes (with optional `?folder=` query) |
| GET | `/api/notes/folders` | Get all unique folders |
| GET | `/api/notes/:id` | Get a single note |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |
| PATCH | `/api/notes/:id/pin` | Toggle pin status |
| PATCH | `/api/notes/:id/color` | Update note color |
| PATCH | `/api/notes/:id/folder` | Move note to folder |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |

### Example API Usage

**Create a prompt:**
```bash
curl -X POST http://localhost:8080/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Prompt",
    "content": "This is my prompt content",
    "model": "GPT-4",
    "tags": ["ai", "coding"]
  }'
```

**Get all prompts:**
```bash
curl http://localhost:8080/api/prompts
```

**Refine a prompt with AI:**
```bash
curl -X POST http://localhost:8080/api/prompts/refine \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Your prompt text here"}'
```

**Create a note:**
```bash
curl -X POST http://localhost:8080/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Note",
    "content": "Note content here",
    "color": "amber",
    "is_pinned": false
  }'
```

---

## 🤖 AI Features

### Prompt Refinement

The application includes an AI-powered prompt refinement feature powered by LangChain and OpenAI GPT-4o-mini:

1. **Generate or edit a prompt** using the Requirements Constructor or Prompt Library
2. **Click "Refine with AI"** button in the preview panel
3. **Compare side-by-side** the original and refined versions
4. **Use the refined version** if you prefer it, or continue editing

The refinement process improves:
- Clarity and specificity
- Structure and organization
- Context and detail
- Professional language
- Best practices adherence

**Note**: You need to set up your OpenAI API key in `backend/.env` file for this feature to work.

### Prompt Confidence Analyzer

The confidence analyzer evaluates prompts based on:

1. **Length** (0-20 points): Optimal token count (50-500 tokens)
2. **Structure** (0-20 points): Numbered lists, bullet points, clear sections, headers
3. **Specificity** (0-25 points): Action verbs, output format, constraints
4. **Examples** (0-15 points): Few-shot examples, I/O patterns
5. **Role/Persona** (0-10 points): Defined role or expertise
6. **Chain of Thought** (0-10 points): Step-by-step reasoning guidance
7. **EmotionPrompt** (0-15 bonus points): Emotional stimuli based on research

Confidence levels:
- **High** (70-100): Excellent prompt quality
- **Good** (45-69): Good prompt with room for improvement
- **Medium** (25-44): Basic prompt, needs enhancement
- **Low** (0-24): Prompt needs significant improvement

---

## 🎨 User Interface

### Design Philosophy

- **Clean & Modern**: Minimalist design with focus on content
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: Keyboard navigation and screen reader support
- **Fast**: Optimized performance with lazy loading and efficient rendering
- **Intuitive**: Clear navigation and user-friendly interactions

### Key UI Features

- **Real-time Updates**: Instant feedback on all actions
- **Toast Notifications**: Non-intrusive success/error messages
- **Loading States**: Clear indicators during async operations
- **Empty States**: Helpful messages when no data is available
- **Modal Dialogs**: Focused editing experience
- **Collapsible Sections**: Organized, clutter-free interface

---

## 🔒 Security & Best Practices

- **Input Validation**: All API endpoints validate input using Joi schemas
- **SQL Injection Prevention**: Parameterized queries with PostgreSQL
- **CORS**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Environment Variables**: Sensitive data stored in environment variables
- **Database Indexes**: Optimized queries with proper indexing

---

## 📝 License

MIT License - feel free to use this project for any purpose.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Built with ❤️ for the AI development community**
