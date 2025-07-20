const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { 
  analyzeResumeWithAI, 
  analyzeResumeWithSpecificAI, 
  getAvailableProviders 
} = require('../services/aiService');

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Analyze resume endpoint
router.post('/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get AI provider from request body (optional)
    const aiProvider = req.body.aiProvider;

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    // Analyze resume with AI (use specific provider if requested)
    let analysis;
    if (aiProvider && ['gemini', 'openai'].includes(aiProvider.toLowerCase())) {
      analysis = await analyzeResumeWithSpecificAI(resumeText, aiProvider.toLowerCase());
    } else {
      analysis = await analyzeResumeWithAI(resumeText);
    }

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      error: 'Failed to analyze resume',
      message: error.message
    });
  }
});

// Get available AI providers endpoint
router.get('/ai-providers', (req, res) => {
  try {
    const providers = getAvailableProviders();
    res.json({
      success: true,
      data: {
        available: providers,
        current: process.env.AI_PROVIDER || 'gemini',
        supported: ['gemini', 'openai']
      }
    });
  } catch (error) {
    console.error('Error getting AI providers:', error);
    res.status(500).json({
      error: 'Failed to get AI providers',
      message: error.message
    });
  }
});

module.exports = router;
