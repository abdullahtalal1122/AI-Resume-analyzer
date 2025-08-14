'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '../../../components/ui';
import {
    BarChart3,
    TrendingUp,
    FileText,
    Star,
    Calendar,
    Target,
    Brain,
    Trophy
} from 'lucide-react';

interface UserAnalytics {
    totalResumes: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    totalAnalyses: number;
    scoreDistribution: {
        excellent: number; // 90-100
        good: number; // 70-89
        average: number; // 50-69
        poor: number; // 0-49
    };
    recentActivity: Array<{
        date: string;
        count: number;
        averageScore: number;
    }>;
    topKeywords: Array<{
        keyword: string;
        frequency: number;
    }>;
    aiProviderUsage: {
        openai: number;
        gemini: number;
    };
    monthlyProgress: Array<{
        month: string;
        avgScore: number;
        count: number;
    }>;
}

export default function AnalyticsPage() {
    const { user, loading } = useAuth();
    const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Configure axios for authenticated requests
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (!loading && user) {
            fetchAnalytics();
        }
    }, [user, loading]);

    const fetchAnalytics = async () => {
        try {
            setLoadingAnalytics(true);
            const response = await axios.get(`${API_BASE_URL}/resume/user-analytics`);
            if (response.data.success) {
                setAnalytics(response.data.data);
            } else {
                setError('Failed to load analytics data');
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError('Failed to load analytics data');
        } finally {
            setLoadingAnalytics(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadgeColor = (score: number) => {
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
                <p className="text-gray-600">Please log in to view your analytics.</p>
            </div>
        );
    }

    if (loadingAnalytics) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Loading your resume analytics...</p>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                </div>
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchAnalytics}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!analytics || analytics.totalResumes === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Insights into your resume analysis journey</p>
                </div>
                <Card className="text-center py-12">
                    <CardContent>
                        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Data Yet</h3>
                        <p className="text-gray-600 mb-6">
                            Start analyzing resumes to see your analytics dashboard with insights and trends.
                        </p>
                        <button
                            onClick={() => window.location.href = '/resume-analyser'}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Analyze Your First Resume
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600">Insights into your resume analysis journey</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalResumes}</div>
                        <p className="text-xs text-muted-foreground">
                            {analytics.totalAnalyses} total analyses
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${getScoreColor(analytics.averageScore)}`}>
                            {Math.round(analytics.averageScore)}/100
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all resumes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${getScoreColor(analytics.highestScore)}`}>
                            {analytics.highestScore}/100
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Your personal best
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Provider</CardTitle>
                        <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.aiProviderUsage.openai > analytics.aiProviderUsage.gemini ? 'OpenAI' : 'Gemini'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Most used provider
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Score Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5" />
                            <span>Score Distribution</span>
                        </CardTitle>
                        <CardDescription>
                            How your resume scores are distributed
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">Excellent (90-100)</span>
                                </div>
                                <Badge className="bg-green-100 text-green-800">
                                    {analytics.scoreDistribution.excellent}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm">Good (70-89)</span>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800">
                                    {analytics.scoreDistribution.good}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span className="text-sm">Average (50-69)</span>
                                </div>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                    {analytics.scoreDistribution.average}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-sm">Needs Improvement (0-49)</span>
                                </div>
                                <Badge className="bg-red-100 text-red-800">
                                    {analytics.scoreDistribution.poor}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Star className="h-5 w-5" />
                            <span>Top Keywords</span>
                        </CardTitle>
                        <CardDescription>
                            Most frequent keywords in your resumes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics.topKeywords.slice(0, 8).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{item.keyword}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${Math.min(100, (item.frequency / Math.max(...analytics.topKeywords.map(k => k.frequency))) * 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{item.frequency}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>Recent Activity</span>
                    </CardTitle>
                    <CardDescription>
                        Your resume analysis activity over time
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">
                                        {new Date(activity.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {activity.count} {activity.count === 1 ? 'resume' : 'resumes'} analyzed
                                    </p>
                                </div>
                                <div className="text-right">
                                    <Badge className={getScoreBadgeColor(activity.averageScore)}>
                                        Avg: {Math.round(activity.averageScore)}/100
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
