const { ResumeAnalysis } = require('../database/database');
const { deleteFromS3, getSignedUrl } = require('./s3Service');

// Calculate resume score based on analysis
const calculateResumeScore = (analysis) => {
    let score = 0;

    // Skills count (max 30 points)
    const skillsCount = analysis.skills ? analysis.skills.length : 0;
    score += Math.min(skillsCount * 3, 30);

    // Job titles relevance (max 25 points)
    const jobTitlesCount = analysis.jobTitles ? analysis.jobTitles.length : 0;
    score += Math.min(jobTitlesCount * 5, 25);

    // Professional summary quality (max 20 points)
    if (analysis.professionalSummary && analysis.professionalSummary.length > 50) {
        score += 20;
    } else if (analysis.professionalSummary && analysis.professionalSummary.length > 20) {
        score += 10;
    }

    // Improvements needed (inverse scoring - fewer improvements = higher score) (max 25 points)
    const improvementsCount = analysis.improvements ? analysis.improvements.length : 0;
    score += Math.max(25 - (improvementsCount * 3), 0);

    return Math.min(score, 100);
};

// Create new resume analysis record
const createResumeAnalysis = async (data) => {
    try {
        const analysisScore = calculateResumeScore(data.analysis);

        const resumeAnalysis = new ResumeAnalysis({
            ...data,
            analysisScore,
            status: 'completed'
        });

        await resumeAnalysis.save();
        return resumeAnalysis;
    } catch (error) {
        console.error('Error creating resume analysis:', error);
        throw error;
    }
};

// Get user's resume analysis history
const getUserResumeHistory = async (userId, page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;

        const analyses = await ResumeAnalysis.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-analysis.improvements') // Exclude improvements for list view
            .exec();

        const total = await ResumeAnalysis.countDocuments({ userId });

        return {
            analyses,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    } catch (error) {
        console.error('Error getting user resume history:', error);
        throw error;
    }
};

// Get detailed resume analysis by ID
const getResumeAnalysisById = async (analysisId, userId) => {
    try {
        const analysis = await ResumeAnalysis.findOne({
            _id: analysisId,
            userId
        }).exec();

        if (!analysis) {
            throw new Error('Resume analysis not found');
        }

        // Generate signed URL for PDF access
        analysis.signedUrl = getSignedUrl(analysis.s3Key);

        return analysis;
    } catch (error) {
        console.error('Error getting resume analysis:', error);
        throw error;
    }
};

// Delete resume analysis and associated S3 file
const deleteResumeAnalysis = async (analysisId, userId) => {
    try {
        const analysis = await ResumeAnalysis.findOne({
            _id: analysisId,
            userId
        });

        if (!analysis) {
            throw new Error('Resume analysis not found');
        }

        // Delete from S3
        await deleteFromS3(analysis.s3Key);

        // Delete from database
        await ResumeAnalysis.findByIdAndDelete(analysisId);

        return { success: true };
    } catch (error) {
        console.error('Error deleting resume analysis:', error);
        throw error;
    }
};

// Get user analytics data
const getUserAnalytics = async (userId) => {
    try {
        const analyses = await ResumeAnalysis.find({ userId }).exec();

        if (analyses.length === 0) {
            return {
                totalResumes: 0,
                averageScore: 0,
                scoreProgress: [],
                topSkills: [],
                commonImprovements: []
            };
        }

        // Calculate analytics
        const totalResumes = analyses.length;
        const averageScore = analyses.reduce((sum, a) => sum + a.analysisScore, 0) / totalResumes;

        // Score progress over time
        const scoreProgress = analyses
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map(a => ({
                date: a.createdAt,
                score: a.analysisScore
            }));

        // Top skills analysis
        const skillsMap = {};
        analyses.forEach(a => {
            if (a.analysis.skills) {
                a.analysis.skills.forEach(skill => {
                    skillsMap[skill] = (skillsMap[skill] || 0) + 1;
                });
            }
        });

        const topSkills = Object.entries(skillsMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([skill, count]) => ({ skill, count }));

        // Common improvements
        const improvementsMap = {};
        analyses.forEach(a => {
            if (a.analysis.improvements) {
                a.analysis.improvements.forEach(improvement => {
                    improvementsMap[improvement] = (improvementsMap[improvement] || 0) + 1;
                });
            }
        });

        const commonImprovements = Object.entries(improvementsMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([improvement, count]) => ({ improvement, count }));

        return {
            totalResumes,
            averageScore: Math.round(averageScore),
            scoreProgress,
            topSkills,
            commonImprovements
        };
    } catch (error) {
        console.error('Error getting user analytics:', error);
        throw error;
    }
};

module.exports = {
    createResumeAnalysis,
    getUserResumeHistory,
    getResumeAnalysisById,
    deleteResumeAnalysis,
    getUserAnalytics,
    calculateResumeScore
};
