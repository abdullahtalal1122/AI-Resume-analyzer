'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
    IconArrowLeft,
    IconBrandTabler,
    IconFileText,
    IconUserBolt,
} from '@tabler/icons-react';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="flex h-full w-full flex-1 flex-col gap-2 p-2 md:p-10">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}!</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your resume analysis and career insights.</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-500/10 dark:bg-blue-400/10">
                            <IconFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Analysis</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Get AI-powered insights</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-green-200 dark:border-green-800">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-500/10 dark:bg-green-400/10">
                            <IconBrandTabler className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Analysis</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Upload and analyze instantly</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-500/10 dark:bg-purple-400/10">
                            <IconUserBolt className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Career Insights</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Improve your profile</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Ready to analyze your resume?</h2>
                <p className="text-blue-100 mb-4">
                    Get personalized feedback and improve your chances of landing your dream job.
                </p>
                <Link
                    href="/resume-analyser"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
                >
                    Start Analysis
                    <IconArrowLeft className="ml-2 -mr-1 w-4 h-4 rotate-180" />
                </Link>
            </div>

            {/* Stats placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="h-32 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
                <div className="h-32 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
            </div>
        </div>
    );
}
