'use client'

import { useApplicationStore } from '@/store/applicationStore'
import type { FormStep } from '@/schemas/applicationSchema'

const steps = [
  { number: 1, title: 'Personal Information', description: 'Basic details' },
  { number: 2, title: 'Employment & Income', description: 'Work information' },
  { number: 3, title: 'Loan Details', description: 'Loan requirements' },
  { number: 4, title: 'Review & Submit', description: 'Final review' },
]

export default function ProgressBar() {
  const { currentStep, completedSteps } = useApplicationStore()

  const getStepStatus = (stepNumber: FormStep) => {
    if (completedSteps.includes(stepNumber)) return 'completed'
    if (currentStep === stepNumber) return 'current'
    return 'pending'
  }

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="absolute top-4 left-0 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div 
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between relative">
        {steps.map((step) => {
          const status = getStepStatus(step.number as FormStep)
          
          return (
            <div key={step.number} className="flex flex-col items-center text-center flex-1">
              {/* Step Circle */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  status === 'completed'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : status === 'current'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-800'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {status === 'completed' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              
              {/* Step Info */}
              <div className="mt-2">
                <div
                  className={`text-xs font-medium ${
                    status === 'current'
                      ? 'text-blue-600 dark:text-blue-400'
                      : status === 'completed'
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}