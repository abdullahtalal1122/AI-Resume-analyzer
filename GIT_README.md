# Smart Resume Analyzer 🚀

An AI-powered full-stack web application that analyzes PDF resumes and provides career insights using multiple AI providers (Google Gemini & OpenAI GPT-4).

![Smart Resume Analyzer](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI-orange)

## ✨ Features

- 📄 **PDF Resume Upload** - Drag & drop PDF resume analysis
- 🤖 **Dual AI Support** - Choose between Google Gemini Pro & OpenAI GPT-4
- 🎯 **Comprehensive Analysis**:
  - Skills extraction
  - Job role recommendations
  - Resume improvement suggestions
  - Professional summary generation
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- ⚡ **Real-time Processing** - Instant analysis with loading states
- 🔒 **Secure** - Environment-based API key management

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **File Processing**: Multer + PDF-Parse
- **AI Integration**: LangChain

### AI Providers
- **Google Gemini Pro** - Advanced reasoning and analysis
- **OpenAI GPT-4** - Superior language understanding

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud API key (for Gemini)
- OpenAI API key (for GPT-4)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   GOOGLE_API_KEY=your_google_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   AI_PROVIDER=gemini  # or 'openai'
   PORT=5000
   ```

4. **Get API Keys**
   
   **Google Gemini:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Generative AI API
   - Create an API key
   
   **OpenAI:**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account/sign in
   - Generate new secret key

5. **Start Development**
   ```bash
   npm run dev
   ```
   
   This starts:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## 📁 Project Structure

```
smart-resume-analyzer/
├── backend/                    # Express.js API server
│   ├── routes/
│   │   └── analyzeResume.js   # Resume analysis endpoints
│   ├── services/
│   │   └── aiService.js       # AI provider integration
│   ├── server.js              # Main server file
│   ├── .env.example           # Environment template
│   └── package.json
├── frontend/                   # Next.js React application
│   ├── app/
│   │   ├── page.tsx           # Main UI component
│   │   ├── layout.tsx         # App layout
│   │   └── globals.css        # Global styles
│   ├── tailwind.config.js     # Tailwind configuration
│   └── package.json
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
└── package.json              # Root package file
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start both frontend & backend
npm run dev:backend      # Start only backend server
npm run dev:frontend     # Start only frontend server

# Installation
npm run install-all      # Install all dependencies

# Production
npm run build:frontend   # Build frontend for production
npm run start:backend    # Start backend in production
npm run start:frontend   # Start frontend in production
```

## 🔌 API Endpoints

### POST `/api/analyze-resume`
Analyze uploaded resume with selected AI provider.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: 
  - `resume`: PDF file (max 5MB)
  - `aiProvider`: `"gemini"` or `"openai"` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": ["JavaScript", "React", "Node.js"],
    "jobTitles": ["Frontend Developer", "Full Stack Developer"],
    "improvements": ["Add more quantified achievements"],
    "professionalSummary": "Experienced developer...",
    "aiProvider": "gemini",
    "timestamp": "2025-07-20T10:30:00.000Z"
  }
}
```

### GET `/api/ai-providers`
Get available AI providers and current configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "available": ["gemini", "openai"],
    "current": "gemini",
    "supported": ["gemini", "openai"]
  }
}
```

## 🎯 Usage

1. Open http://localhost:3000
2. Choose your preferred AI provider (Gemini/OpenAI)
3. Upload a PDF resume (max 5MB)
4. Click "Analyze Resume" 
5. View comprehensive AI-generated insights:
   - **Skills**: Technical and soft skills extracted
   - **Job Roles**: Matching position recommendations  
   - **Improvements**: Specific resume enhancement suggestions
   - **Summary**: Professional 2-line summary

## ⚙️ Configuration

### AI Provider Selection
Switch between AI providers by:
1. **Environment Variable**: Set `AI_PROVIDER=openai` or `AI_PROVIDER=gemini`
2. **Frontend UI**: Select provider before analysis
3. **API Parameter**: Send `aiProvider` in request body

### Customization
- **Prompts**: Edit `backend/services/aiService.js`
- **UI Components**: Modify `frontend/app/page.tsx`  
- **Styling**: Update Tailwind classes
- **API Logic**: Enhance `backend/routes/analyzeResume.js`

## 🔧 Troubleshooting

### Common Issues

**"API Key Error"**
- Verify API keys in `.env` file
- Ensure Generative AI API is enabled (Google Cloud)
- Check OpenAI account has credits

**"PDF Parsing Failed"**  
- Ensure PDF contains selectable text (not scanned image)
- Check file size is under 5MB
- Try with different PDF file

**"Port Already in Use"**
- Change ports in `.env` file
- Kill existing processes: `lsof -ti:3000 | xargs kill`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Google Gemini API](https://ai.google.dev/)
- [OpenAI API](https://platform.openai.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [LangChain](https://docs.langchain.com/)

## 📈 Roadmap

- [ ] Support for multiple file formats (DOCX, TXT)
- [ ] Resume scoring system
- [ ] Job market insights integration
- [ ] Resume templates generation
- [ ] Batch processing
- [ ] User accounts and history

---

**Built with ❤️ using Next.js, Node.js, and AI**
