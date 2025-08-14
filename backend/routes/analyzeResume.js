const express = require('express');
const pdfParse = require('pdf-parse');
const { verifyToken } = require('../middleware/auth');
const { uploadToS3, getFileFromS3 } = require('../services/s3Service');
const {
  createResumeAnalysis,
  getUserResumeHistory,
  getResumeAnalysisById,
  deleteResumeAnalysis,
  getUserAnalytics
} = require('../services/resumeService');
const {
  analyzeResumeWithAI,
  analyzeResumeWithSpecificAI,
  getAvailableProviders
} = require('../services/aiService'); const router = express.Router();

// Analyze resume endpoint (protected route) - now with S3 storage
router.post('/analyze-resume', verifyToken, uploadToS3.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get AI provider from request body (optional)
    const aiProvider = req.body.aiProvider;

    // Extract text from PDF using S3 file
    const pdfBuffer = await getFileFromS3(req.file.key);
    const pdfData = await pdfParse(pdfBuffer);
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

    // Save resume analysis to database
    const resumeAnalysisData = {
      userId: req.user.id,
      fileName: req.file.key,
      originalFileName: req.file.originalname,
      s3Key: req.file.key,
      s3Url: req.file.location,
      fileSize: req.file.size,
      analysis: analysis,
      industry: req.body.industry || null
    };

    const savedAnalysis = await createResumeAnalysis(resumeAnalysisData);

    res.json({
      success: true,
      data: {
        ...analysis,
        analysisId: savedAnalysis._id,
        analysisScore: savedAnalysis.analysisScore,
        savedAt: savedAnalysis.createdAt
      }
    });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      error: 'Failed to analyze resume',
      message: error.message
    });
  }
});

// Get user's resume history endpoint (protected route)
router.get('/resume-history', verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const history = await getUserResumeHistory(req.user.id, page, limit);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error getting resume history:', error);
    res.status(500).json({
      error: 'Failed to get resume history',
      message: error.message
    });
  }
});

// Get specific resume analysis endpoint (protected route)
router.get('/resume-analysis/:id', verifyToken, async (req, res) => {
  try {
    const analysis = await getResumeAnalysisById(req.params.id, req.user.id);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error getting resume analysis:', error);
    res.status(500).json({
      error: 'Failed to get resume analysis',
      message: error.message
    });
  }
});

// Delete resume analysis endpoint (protected route)
router.delete('/resume-analysis/:id', verifyToken, async (req, res) => {
  try {
    await deleteResumeAnalysis(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Resume analysis deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume analysis:', error);
    res.status(500).json({
      error: 'Failed to delete resume analysis',
      message: error.message
    });
  }
});

// Get user analytics endpoint (protected route)
router.get('/user-analytics', verifyToken, async (req, res) => {
  try {
    const analytics = await getUserAnalytics(req.user.id);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting user analytics:', error);
    res.status(500).json({
      error: 'Failed to get analytics',
      message: error.message
    });
  }
});

// Get available AI providers endpoint (protected route)
router.get('/ai-providers', verifyToken, (req, res) => {
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
