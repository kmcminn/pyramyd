'use client'

import { useState } from 'react'
import { useApplicationStore } from '@/store/applicationStore'
import { applicationSchema } from '@/schemas/applicationSchema'

export default function ReviewSubmitForm() {
  const { 
    personalInfo, 
    employmentInfo, 
    loanDetails, 
    previousStep, 
    markStepCompleted,
    resetForm 
  } = useApplicationStore()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions before submitting.')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Validate all form data
      const applicationData = {
        personalInfo,
        employmentInfo,
        loanDetails,
        submittedAt: new Date()
      }
      
      const validatedData = applicationSchema.parse(applicationData)
      
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Application submitted:', validatedData)
      
      markStepCompleted(4)
      setIsSubmitted(true)
      setIsSubmitting(false)
      
      // Clear form data after successful submission
      setTimeout(() => {
        resetForm()
      }, 5000)
      
    } catch (error) {
      console.error('Submission error:', error)
      setIsSubmitting(false)
      alert('There was an error submitting your application. Please review all forms and try again.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getLoanPurposeLabel = (purpose: string) => {
    const purposes: Record<string, string> = {
      'home-purchase': 'Home Purchase',
      'home-refinance': 'Home Refinance',
      'debt-consolidation': 'Debt Consolidation',
      'business': 'Business',
      'education': 'Education',
      'personal': 'Personal',
      'other': 'Other'
    }
    return purposes[purpose] || purpose
  }

  const getEmploymentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contract': 'Contract',
      'self-employed': 'Self-employed'
    }
    return types[type] || type
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Thank you for your application. We&apos;ll review your information and get back to you within 2-3 business days.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            You will receive a confirmation email shortly with your application reference number.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Start New Application
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please review all your information before submitting your application.
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Name:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {personalInfo.firstName} {personalInfo.lastName}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Email:</span>
              <p className="font-medium text-gray-900 dark:text-white">{personalInfo.email}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Phone:</span>
              <p className="font-medium text-gray-900 dark:text-white">{personalInfo.phone}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Address:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {personalInfo.address}, {personalInfo.city}, {personalInfo.state} {personalInfo.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Employment Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Employment & Income
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Employer:</span>
              <p className="font-medium text-gray-900 dark:text-white">{employmentInfo.employer}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Position:</span>
              <p className="font-medium text-gray-900 dark:text-white">{employmentInfo.position}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Employment Type:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {getEmploymentTypeLabel(employmentInfo.employmentType || '')}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Years Employed:</span>
              <p className="font-medium text-gray-900 dark:text-white">{employmentInfo.yearsEmployed} years</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Annual Salary:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(employmentInfo.annualSalary || 0)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Monthly Income:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(employmentInfo.monthlyIncome || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Loan Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Loan Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Loan Amount:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(loanDetails.loanAmount || 0)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Loan Purpose:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {getLoanPurposeLabel(loanDetails.loanPurpose || '')}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Loan Term:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {loanDetails.loanTerm} months
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Down Payment:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(loanDetails.downPayment || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>. I understand that this application will be reviewed and that approval is not guaranteed. I certify that all information provided is accurate and complete.
            </label>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={previousStep}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            Back to Loan Details
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !agreedToTerms}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Application</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}