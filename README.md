# Smart Resume Analyzer

A full-stack AI-powered web application that analyzes PDF resumes and provides career insights using Google Gemini AI.

## ✅ PROJECT COMPLETED

### Features Implemented:
- ✅ **Frontend**: Next.js 14 with App Router and Tailwind CSS
- ✅ **Backend**: Node.js with Express server
- ✅ **PDF Processing**: File upload and text extraction using pdf-parse
- ✅ **AI Integration**: LangChain with Google Gemini for resume analysis
- ✅ **Responsive UI**: Clean, modern interface with loading states
- ✅ **Error Handling**: Comprehensive error handling and user feedback

### Tech Stack:
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Multer, PDF-Parse
- **AI**: LangChain, Google Gemini Pro
- **Development**: Concurrently, Nodemon

## 🚀 Quick Start

### 1. Setup Environment
```bash
cd backend
cp .env.example .env
# Edit .env and add your Google API key
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Run Development Servers
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend app on http://localhost:3000

### 4. Get Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable Generative AI API
4. Create an API key
5. Add it to `backend/.env`

## 📁 Project Structure
```
smart-resume-analyzer/
├── backend/
│   ├── routes/analyzeResume.js     # Resume analysis endpoint
│   ├── services/aiService.js       # Gemini AI integration
│   ├── server.js                   # Express server setup
│   └── .env                        # Environment variables
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Main UI component
│   │   ├── layout.tsx             # App layout
│   │   └── globals.css            # Global styles
│   └── [config files]
└── [root config files]
```

## 🔧 Available Scripts
- `npm run dev` - Start both servers in development mode
- `npm run dev:backend` - Start only backend server
- `npm run dev:frontend` - Start only frontend server
- `npm run install-all` - Install all dependencies

## 📝 Usage
1. Open http://localhost:3000
2. Upload a PDF resume (max 5MB)
3. Click "Analyze Resume"
4. View AI-generated insights:
   - Extracted skills
   - Recommended job roles
   - Improvement suggestions
   - Professional summary

---

## Original Requirements Reference:



PROJECT PERPOSAL : 

FYP Project Proposal
Project Title:
 Smart Resume Analyzer – AI-Powered Career Insight Tool
Overview:
The Smart Resume Analyzer is a web-based application designed to help students and job seekers evaluate and improve their resumes using AI. By simply uploading a resume (in PDF format), users receive instant feedback including extracted skills, matching job titles, areas of improvement, and a professional summary. The application leverages React for the frontend, Node.js for the backend, and OpenAI’s GPT/Gemini API to power the AI-based analysis.
Modules:
Resume Upload & Parsing
 Users can upload resumes which are parsed to extract textual content using server-side tools.


AI-Powered Resume Analysis
 The extracted resume content is processed by GPT/Gemine to:


Extract key skills
Recommend suitable job roles
Suggest missing or weak skills
Generate a short professional summary


Result Dashboard
 The frontend displays a clean, structured report of the AI analysis with interactive UI components for an enhanced user experience.


Target Audience:
University students and recent graduates preparing for jobs
Freelancers and professionals seeking feedback on their resumes
Career counselors and job preparation platforms


Reason :
 In today's competitive job market, resume quality plays a critical role. Most students struggle to align their resumes with market expectations. This tool provides instant, practical, and AI-driven feedback, helping users enhance their resumes and better position themselves for job opportunities  with minimal effort and maximum value.
