'use client'

import { useState } from 'react'
import { useApplicationStore } from '@/store/applicationStore'
import { loanDetailsSchema, type LoanDetails } from '@/schemas/applicationSchema'

export default function LoanDetailsForm() {
  const { loanDetails, setLoanDetails, nextStep, previousStep, markStepCompleted } = useApplicationStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<Partial<LoanDetails>>({
    loanAmount: loanDetails.loanAmount || undefined,
    loanPurpose: loanDetails.loanPurpose || 'personal',
    loanTerm: loanDetails.loanTerm || 36,
    downPayment: loanDetails.downPayment || undefined,
  })

  const handleChange = (field: keyof LoanDetails, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateField = (field: keyof LoanDetails, value: string | number | undefined) => {
    if (field === 'loanAmount') {
      if (!value || (typeof value === 'number' && value <= 0)) {
        return 'Loan amount is required'
      }
      if (typeof value === 'number' && value < 1000) {
        return 'Loan amount must be at least $1,000'
      }
    }
    
    if (field === 'loanPurpose') {
      if (!value) {
        return 'Loan purpose is required'
      }
    }
    
    if (field === 'loanTerm') {
      if (!value || (typeof value === 'number' && value <= 0)) {
        return 'Loan term is required'
      }
      if (typeof value === 'number' && value < 12) {
        return 'Loan term must be at least 12 months'
      }
      if (typeof value === 'number' && value > 360) {
        return 'Loan term cannot exceed 360 months'
      }
    }
    
    if (field === 'downPayment' && value !== undefined && value !== null) {
      if (typeof value === 'number' && value <= 0) {
        return 'Down payment must be greater than $0 (leave empty if no down payment)'
      }
    }
    
    return ''
  }

  const handleBlur = (field: keyof LoanDetails, value: string | number | undefined) => {
    const error = validateField(field, value)
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all required fields first
    const newErrors: Record<string, string> = {}
    const requiredFields: (keyof LoanDetails)[] = ['loanAmount', 'loanPurpose', 'loanTerm']
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
      }
    })
    
    // Validate optional down payment if provided
    if (formData.downPayment !== undefined && formData.downPayment !== null && formData.downPayment !== 0) {
      const downPaymentError = validateField('downPayment', formData.downPayment)
      if (downPaymentError) {
        newErrors.downPayment = downPaymentError
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Flash effect for empty fields
      const firstErrorField = document.getElementById(Object.keys(newErrors)[0])
      if (firstErrorField) {
        firstErrorField.focus()
        firstErrorField.classList.add('animate-pulse')
        setTimeout(() => {
          firstErrorField.classList.remove('animate-pulse')
        }, 1000)
      }
      return
    }
    
    try {
      // Clean up formData for validation - remove downPayment if empty
      const cleanedData = { ...formData }
      if (!cleanedData.downPayment || cleanedData.downPayment === 0) {
        delete cleanedData.downPayment
      }
      
      const validatedData = loanDetailsSchema.parse(cleanedData)
      setLoanDetails(validatedData)
      markStepCompleted(3)
      nextStep()
      setErrors({})
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodErrors: Record<string, string> = {}
        const zodError = error as { errors: Array<{ path: Array<string>; message: string }> }
        zodError.errors.forEach((err) => {
          zodErrors[err.path[0]] = err.message
        })
        setErrors(zodErrors)
      }
    }
  }

  const calculateMonthlyPayment = () => {
    const { loanAmount, loanTerm } = formData
    if (!loanAmount || !loanTerm) return 0
    
    const principal = loanAmount - (formData.downPayment || 0)
    const monthlyRate = 0.05 / 12 // Assuming 5% annual rate
    const numPayments = loanTerm
    
    if (monthlyRate === 0) return principal / numPayments
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    return Math.round(monthlyPayment)
  }

  const loanPurposeOptions = [
    { value: 'home-purchase', label: 'Home Purchase' },
    { value: 'home-refinance', label: 'Home Refinance' },
    { value: 'debt-consolidation', label: 'Debt Consolidation' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'personal', label: 'Personal' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Loan Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Specify the loan amount, purpose, and terms that work best for you.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Loan amount, purpose, and term are required. Down payment is optional but must be greater than $0 if provided.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loan Amount and Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                id="loanAmount"
                min="1000"
                step="1000"
                value={formData.loanAmount || ''}
                onChange={(e) => handleChange('loanAmount', parseFloat(e.target.value) || undefined)}
                onBlur={(e) => handleBlur('loanAmount', parseFloat(e.target.value) || undefined)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                  errors.loanAmount ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="50000"
              />
            </div>
            {errors.loanAmount && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.loanAmount}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="loanPurpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Purpose *
            </label>
            <select
              id="loanPurpose"
              value={formData.loanPurpose}
              onChange={(e) => handleChange('loanPurpose', e.target.value as LoanDetails['loanPurpose'])}
              onBlur={(e) => handleBlur('loanPurpose', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.loanPurpose ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {loanPurposeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.loanPurpose && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.loanPurpose}</p>
              </div>
            )}
          </div>
        </div>

        {/* Loan Term and Down Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Term (months) *
            </label>
            <select
              id="loanTerm"
              value={formData.loanTerm}
              onChange={(e) => handleChange('loanTerm', parseInt(e.target.value))}
              onBlur={(e) => handleBlur('loanTerm', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.loanTerm ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value={12}>12 months (1 year)</option>
              <option value={24}>24 months (2 years)</option>
              <option value={36}>36 months (3 years)</option>
              <option value={48}>48 months (4 years)</option>
              <option value={60}>60 months (5 years)</option>
              <option value={84}>84 months (7 years)</option>
              <option value={120}>120 months (10 years)</option>
              <option value={180}>180 months (15 years)</option>
              <option value={240}>240 months (20 years)</option>
              <option value={360}>360 months (30 years)</option>
            </select>
            {errors.loanTerm && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.loanTerm}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Down Payment (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                id="downPayment"
                min="1"
                step="1000"
                value={formData.downPayment || ''}
                onChange={(e) => handleChange('downPayment', parseFloat(e.target.value) || undefined)}
                onBlur={(e) => handleBlur('downPayment', parseFloat(e.target.value) || undefined)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                  errors.downPayment ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Leave empty if no down payment"
              />
            </div>
            {errors.downPayment && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.downPayment}</p>
              </div>
            )}
          </div>
        </div>

        {/* Loan Summary */}
        {formData.loanAmount && formData.loanTerm && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Loan Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Loan Amount:</span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${formData.loanAmount?.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Down Payment:</span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${(formData.downPayment || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Principal Amount:</span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${((formData.loanAmount || 0) - (formData.downPayment || 0)).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Est. Monthly Payment:</span>
                <p className="font-semibold text-blue-600 dark:text-blue-400">
                  ${calculateMonthlyPayment().toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              *Estimated payment based on 5% annual interest rate. Actual rates may vary.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={previousStep}
            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Back to Employment Info
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  )
}