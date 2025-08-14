'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '../../../components/ui';
import { FileText, Calendar, Download, Trash2 } from 'lucide-react';

interface ResumeAnalysis {
    _id: string;
    userId: string;
    filename: string;
    s3Key: string;
    s3Url: string;
    analysisResult: {
        aiProvider: string;
        analysis: string;
        score: number;
        strengths: string[];
        improvements: string[];
        keywords: string[];
        suggestions: string[];
    };
    createdAt: string;
    updatedAt: string;
}

interface ResumeHistoryResponse {
    analyses: ResumeAnalysis[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export default function ResumeHistoryPage() {
    const { user, loading } = useAuth();
    const [resumeHistory, setResumeHistory] = useState<ResumeHistoryResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Configure axios for authenticated requests
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (!loading && user) {
            fetchResumeHistory();
        }
    }, [user, loading, currentPage]);

    const fetchResumeHistory = async () => {
        try {
            setLoadingHistory(true);
            const response = await axios.get(`${API_BASE_URL}/resume/resume-history?page=${currentPage}&limit=10`);
            if (response.data.success) {
                setResumeHistory(response.data.data);
            } else {
                setError('Failed to load resume history');
            }
        } catch (error) {
            console.error('Error fetching resume history:', error);
            setError('Failed to load resume history');
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleDelete = async (analysisId: string) => {
        if (!confirm('Are you sure you want to delete this resume analysis? This action cannot be undone.')) {
            return;
        }

        try {
            setDeletingId(analysisId);
            const response = await axios.delete(`${API_BASE_URL}/resume/resume-analysis/${analysisId}`);
            if (response.data.success) {
                // Refresh the history after deletion
                fetchResumeHistory();
            } else {
                setError('Failed to delete resume analysis');
            }
        } catch (error) {
            console.error('Error deleting resume analysis:', error);
            setError('Failed to delete resume analysis');
        } finally {
            setDeletingId(null);
        }
    };

    const handleDownload = async (s3Url: string, filename: string) => {
        try {
            const response = await fetch(s3Url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
            setError('Failed to download file');
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        return 'bg-red-100 text-red-800 border-red-300';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Please log in to view your resume history.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume History</h1>
                <p className="text-gray-600">View and manage your analyzed resumes</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-red-800">{error}</p>
                    <Button
                        onClick={() => setError(null)}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : resumeHistory && resumeHistory.analyses.length > 0 ? (
                <>
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                        {resumeHistory.analyses.map((analysis) => (
                            <Card key={analysis._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-6 w-6 text-blue-600" />
                                            <div>
                                                <CardTitle className="text-lg truncate max-w-xs">
                                                    {analysis.filename}
                                                </CardTitle>
                                                <CardDescription className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge
                                            className={`${getScoreColor(analysis.analysisResult.score)} border`}
                                        >
                                            Score: {analysis.analysisResult.score}/100
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">AI Analysis Summary</h4>
                                            <p className="text-sm text-gray-600 line-clamp-3">
                                                {analysis.analysisResult.analysis.substring(0, 150)}...
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {analysis.analysisResult.keywords.slice(0, 3).map((keyword, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {keyword}
                                                </Badge>
                                            ))}
                                            {analysis.analysisResult.keywords.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{analysis.analysisResult.keywords.length - 3} more
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <span className="text-xs text-gray-500">
                                                Analyzed with {analysis.analysisResult.aiProvider}
                                            </span>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDownload(analysis.s3Url, analysis.filename)}
                                                    className="flex items-center space-x-1"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    <span>Download</span>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(analysis._id)}
                                                    disabled={deletingId === analysis._id}
                                                    className="flex items-center space-x-1"
                                                >
                                                    {deletingId === analysis._id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    <span>Delete</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {resumeHistory.pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-4 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={!resumeHistory.pagination.hasPrev}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600">
                                Page {resumeHistory.pagination.currentPage} of {resumeHistory.pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={!resumeHistory.pagination.hasNext}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Resume History</h3>
                        <p className="text-gray-600 mb-6">
                            You haven't analyzed any resumes yet. Upload your first resume to get started!
                        </p>
                        <Button onClick={() => window.location.href = '/resume-analyser'}>
                            Analyze Resume
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
