'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Smart Resume Analyzer
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              AI-Powered Career Insight Tool
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Get personalized feedback on your resume with advanced AI analysis.
              Improve your chances of landing your dream job with actionable insights.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-blue-100">
                Advanced AI algorithms analyze your resume for skills, experience, and optimization opportunities.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Feedback</h3>
              <p className="text-blue-100">
                Get immediate insights and suggestions to improve your resume's impact and effectiveness.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Career Insights</h3>
              <p className="text-blue-100">
                Discover job roles that match your skills and get recommendations for career advancement.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Get Started Today</h2>
              <div className="space-y-4">
                <Link
                  href="/signup"
                  className="block w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-md hover:bg-blue-50 transition-colors duration-200"
                >
                  Create Account
                </Link>
                <Link
                  href="/login"
                  className="block w-full border-2 border-white text-white font-semibold py-3 px-6 rounded-md hover:bg-white hover:text-blue-600 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
              <p className="text-blue-200 text-sm mt-4">
                Already have an account? Sign in to access your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
