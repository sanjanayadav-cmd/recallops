# RecallOps

## AI Incident Intelligence with Persistent Memory

RecallOps is an AI-powered incident response assistant for software engineering teams.

It analyzes production incidents, retrieves relevant historical incidents from persistent Hindsight memory, and uses that context to provide more informed investigation and resolution guidance.

Engineers can also record the root cause, resolution, and outcome of an incident so future incidents can benefit from that experience.

## Problem

Production incidents are often repetitive. An engineering team may have already solved a database timeout, deployment failure, or service instability issue in the past, but that useful context can be difficult to find when a similar incident happens again.

RecallOps connects AI incident analysis with persistent memory so previous engineering experience can be reused.

## How It Works

Engineer → React Frontend → Node.js/Express Backend → Hindsight + Groq → AI Incident Analysis

## Memory Loop

Incident → Investigation → Root Cause → Resolution → Outcome → Hindsight Memory → Future Incident → Relevant Memories Recalled → Better Context

## Hindsight Integration

RecallOps uses Hindsight as its persistent memory layer.

When an engineer resolves an incident, RecallOps stores:

- Incident description
- Root cause
- Resolution
- Outcome

When a new incident is analyzed, RecallOps retrieves relevant historical memories and provides them to the AI model as additional context.

This creates a learning loop across incidents instead of treating every request as an isolated conversation.

Hindsight: https://hindsight.vectorize.io/

Hindsight GitHub: https://github.com/vectorize-io/hindsight

## Example

### First Incident

A production API experiences intermittent database timeouts.

The engineering team discovers that the database connection pool was exhausted because connections were not being released correctly.

The team fixes the connection handling and increases the connection pool size.

RecallOps stores this resolution in Hindsight.

### Later Incident

A similar database timeout happens after another deployment.

RecallOps retrieves relevant historical memories and provides them to the AI.

The AI can compare the current incident with previous experience while distinguishing historical information from its own recommendation.

## Features

- AI-powered production incident analysis
- Persistent incident memory using Hindsight
- Historical memory retrieval
- Root cause and resolution recording
- Groq-powered LLM analysis
- Hindsight memory visibility
- React frontend
- Node.js and Express backend

## Tech Stack

Frontend:
- React
- Vite
- CSS

Backend:
- Node.js
- Express
- CORS
- dotenv

AI:
- Groq
- openai/gpt-oss-120b

Memory:
- Hindsight
- @vectorize-io/hindsight-client

## API Endpoints

### Health Check

GET /api/health

### Analyze Incident

POST /api/incidents/analyze

Receives an incident, retrieves relevant Hindsight memories, and sends the current incident plus historical context to the AI model.

### Resolve Incident

POST /api/incidents/resolve

Stores the incident, root cause, resolution, and outcome in Hindsight.

## Project Structure

recallops/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md

## Environment Variables

Create backend/.env:

HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_api_key
GROQ_API_KEY=your_groq_api_key

Never commit API keys to GitHub.

## Running Locally

### Backend

cd backend
npm install
node server.js

Backend runs on http://localhost:5000

### Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend runs on http://localhost:5173

## What Makes RecallOps Different

The core idea is not simply asking an LLM to analyze an incident.

RecallOps gives the AI access to persistent engineering experience.

Current incident + Relevant previous experience → Context-aware AI analysis → Engineer resolution → New persistent experience

This allows the system to accumulate useful incident knowledge over time.

## Limitations

RecallOps is currently a prototype demonstrating persistent incident memory.

The current system does not automatically connect to production monitoring systems, logs, traces, or deployment infrastructure.

Incident information is provided by the engineer through the application interface.

## Future Improvements

- Monitoring platform integration
- Automatic log and trace ingestion
- Slack or Microsoft Teams integration
- Incident severity classification
- Automated post-incident summaries
- Engineering knowledge analytics
- Incident timelines
- Role-based access control

## License

This project is intended as a technical prototype for demonstrating AI-powered incident intelligence and persistent memory.