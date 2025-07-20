# Smart Resume Analyzer Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google API Key for Gemini

## Installation Steps

### 1. Install Dependencies
Run the following command from the root directory:
```bash
npm run install-all
```

Or install manually:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup
1. Navigate to the `backend` folder
2. Copy `.env` file and add your Google API Key:
```
GOOGLE_API_KEY=your_actual_google_api_key_here
PORT=5000
```

### 3. Get Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Generative AI API
4. Create credentials (API Key)
5. Copy the API key to your `.env` file

## Running the Application

### Development Mode
From the root directory:
```bash
npm run dev
```

This will start both backend (port 5000) and frontend (port 3000) concurrently.

Or run them separately:
```bash
# Backend only
npm run dev:backend

# Frontend only (in another terminal)
npm run dev:frontend
```

### Production Mode
```bash
# Build frontend
npm run build:frontend

# Start backend
npm run start:backend

# Start frontend (in another terminal)
npm run start:frontend
```

## Usage
1. Open http://localhost:3000 in your browser
2. Upload a PDF resume using the file input
3. Click "Analyze Resume"
4. View the AI-generated results:
   - Extracted skills
   - Recommended job roles
   - Suggested improvements
   - Professional summary

## Project Structure
```
smart-resume-analyzer/
├── backend/
│   ├── routes/
│   │   └── analyzeResume.js
│   ├── services/
│   │   └── aiService.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
└── package.json
```

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Multer, PDF-Parse
- **AI**: LangChain, Google Gemini Pro
- **Development**: Concurrently for running both services

## Features
- PDF resume upload and parsing
- AI-powered resume analysis using Google Gemini
- Responsive UI with Tailwind CSS
- Error handling and loading states
- Clean, modular code structure

## Troubleshooting
- Make sure both ports 3000 and 5000 are available
- Verify your Google API key is valid and has Generative AI API enabled
- Check that you're uploading PDF files only (max 5MB)
- Ensure Node.js version is 18 or higher
