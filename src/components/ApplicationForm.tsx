'use client'

import { Suspense, lazy } from 'react'
import { useApplicationStore } from '@/store/applicationStore'
import ProgressBar from './ProgressBar'

// Dynamic imports for form components to reduce bundle size and improve loading
const PersonalInfoForm = lazy(() => import('./forms/PersonalInfoForm'))
const EmploymentInfoForm = lazy(() => import('./forms/EmploymentInfoForm'))
const LoanDetailsForm = lazy(() => import('./forms/LoanDetailsForm'))
const ReviewSubmitForm = lazy(() => import('./forms/ReviewSubmitForm'))

// Loading fallback component for form steps
const FormLoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading form...</p>
    </div>
  </div>
)

export default function ApplicationForm() {
  const { currentStep } = useApplicationStore()

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <Suspense fallback={<FormLoadingFallback />}>
            <PersonalInfoForm />
          </Suspense>
        )
      case 2:
        return (
          <Suspense fallback={<FormLoadingFallback />}>
            <EmploymentInfoForm />
          </Suspense>
        )
      case 3:
        return (
          <Suspense fallback={<FormLoadingFallback />}>
            <LoanDetailsForm />
          </Suspense>
        )
      case 4:
        return (
          <Suspense fallback={<FormLoadingFallback />}>
            <ReviewSubmitForm />
          </Suspense>
        )
      default:
        return (
          <Suspense fallback={<FormLoadingFallback />}>
            <PersonalInfoForm />
          </Suspense>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar />
        
        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {renderCurrentForm()}
        </div>
      </div>
    </div>
  )
}