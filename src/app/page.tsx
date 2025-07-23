'use client'

import { Suspense, lazy } from 'react'
import DarkModeToggle from "@/components/DarkModeToggle";
import { useApplicationStore } from "@/store/applicationStore";

// Dynamic import for ApplicationForm to reduce initial bundle size
const ApplicationForm = lazy(() => import("@/components/ApplicationForm"));

export default function Home() {
  const { isFormStarted, startForm } = useApplicationStore()
  
  if (isFormStarted) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading application form...</p>
          </div>
        </div>
      }>
        <ApplicationForm />
      </Suspense>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="w-full px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold tracking-wider text-gray-900 dark:text-white" style={{ fontVariant: 'small-caps' }}>
            pyramyd
          </div>
          <DarkModeToggle />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Loan Application
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Get the funding you need with our simple, secure application process.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-blue-500 rounded-lg mb-3 flex items-center justify-center mx-auto">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Personal Info</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Basic details and contact information</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-green-500 rounded-lg mb-3 flex items-center justify-center mx-auto">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Employment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Work history and income details</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-purple-500 rounded-lg mb-3 flex items-center justify-center mx-auto">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Loan Details</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Amount, purpose, and terms</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-orange-500 rounded-lg mb-3 flex items-center justify-center mx-auto">
                <span className="text-white font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Review</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Confirm and submit application</p>
            </div>
          </div>

          <div className="mt-16 space-y-4">
            <button 
              onClick={startForm}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg text-lg"
            >
              Start Application
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Takes about 5-10 minutes to complete • Secure & encrypted
            </p>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Secure</h3>
              <p className="text-gray-600 dark:text-gray-300">Your data is encrypted and protected with bank-level security.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">Quick approval process with decisions in 2-3 business days.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Flexible</h3>
              <p className="text-gray-600 dark:text-gray-300">Choose from various loan terms and purposes to fit your needs.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
