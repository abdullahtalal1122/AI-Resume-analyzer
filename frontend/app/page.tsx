'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface AnalysisResult {
  skills: string[];
  jobTitles: string[];
  improvements: string[];
  professionalSummary: string;
  aiProvider?: string;
  timestamp?: string;
  fallback?: boolean;
}

interface AIProvider {
  available: string[];
  current: string;
  supported: string[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedAI, setSelectedAI] = useState<string>('gemini');
  const [availableProviders, setAvailableProviders] = useState<AIProvider | null>(null);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Fetch available AI providers on component mount
  const fetchAIProviders = async () => {
    try {
      setLoadingProviders(true);
      const response = await axios.get('http://localhost:5000/api/ai-providers');
      setAvailableProviders(response.data.data);
      setSelectedAI(response.data.data.current);
    } catch (err) {
      console.error('Failed to fetch AI providers:', err);
    } finally {
      setLoadingProviders(false);
    }
  };

  // Fetch providers on component mount
  useEffect(() => {
    fetchAIProviders();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a PDF file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('aiProvider', selectedAI);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Smart Resume Analyzer
        </h1>
        <p className="text-lg text-gray-600">
          AI-Powered Career Insight Tool
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload Your Resume</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className="cursor-pointer inline-flex flex-col items-center"
          >
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-lg font-medium text-gray-700">
              {file ? file.name : 'Click to upload PDF resume'}
            </span>
            <span className="text-sm text-gray-500 mt-2">
              PDF files only, max 5MB
            </span>
          </label>
        </div>

        {/* AI Provider Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose AI Provider
          </label>
          
          {loadingProviders ? (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
              Loading AI providers...
            </div>
          ) : (
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="aiProvider"
                  value="gemini"
                  checked={selectedAI === 'gemini'}
                  onChange={(e) => setSelectedAI(e.target.value)}
                  className="mr-2"
                />
                <div className="flex items-center">
                  <span className="text-sm font-medium">Google Gemini</span>
                  {availableProviders?.available.includes('gemini') ? (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Available</span>
                  ) : (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">No API Key</span>
                  )}
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="aiProvider"
                  value="openai"
                  checked={selectedAI === 'openai'}
                  onChange={(e) => setSelectedAI(e.target.value)}
                  className="mr-2"
                />
                <div className="flex items-center">
                  <span className="text-sm font-medium">OpenAI GPT-4</span>
                  {availableProviders?.available.includes('openai') ? (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Available</span>
                  ) : (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">No API Key</span>
                  )}
                </div>
              </label>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
          
          {(result || file) && (
            <button
              onClick={resetAnalysis}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-lg">
              Analyzing your resume with {selectedAI === 'gemini' ? 'Google Gemini' : 'OpenAI GPT-4'}...
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* AI Provider Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">
                  Analysis completed using {result.aiProvider === 'gemini' ? 'Google Gemini' : 'OpenAI GPT-4'}
                </span>
                {result.fallback && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Fallback Response
                  </span>
                )}
              </div>
              {result.timestamp && (
                <span className="text-xs text-gray-500">
                  {new Date(result.timestamp).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-primary-700">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed">{result.professionalSummary}</p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-primary-700">Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {result.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Job Roles */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-primary-700">Recommended Job Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.jobTitles.map((title, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-200 rounded-md p-3"
                >
                  <span className="text-green-800 font-medium">{title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-primary-700">Suggested Improvements</h3>
            <ul className="space-y-3">
              {result.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
