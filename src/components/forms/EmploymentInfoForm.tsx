'use client'

import { useState } from 'react'
import { useApplicationStore } from '@/store/applicationStore'
import { employmentInfoSchema, type EmploymentInfo } from '@/schemas/applicationSchema'

export default function EmploymentInfoForm() {
  const { employmentInfo, setEmploymentInfo, nextStep, previousStep, markStepCompleted } = useApplicationStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<Partial<EmploymentInfo>>({
    employer: employmentInfo.employer || '',
    position: employmentInfo.position || '',
    employmentType: employmentInfo.employmentType || 'full-time',
    yearsEmployed: employmentInfo.yearsEmployed || 0,
    annualSalary: employmentInfo.annualSalary || 0,
    monthlyIncome: employmentInfo.monthlyIncome || 0,
  })

  const handleChange = (field: keyof EmploymentInfo, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateField = (field: keyof EmploymentInfo, value: string | number) => {
    if (field === 'employer' || field === 'position') {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    }
    
    if (field === 'yearsEmployed') {
      if (typeof value === 'number' && value < 0) {
        return 'Years employed cannot be negative'
      }
      if (!value && value !== 0) {
        return 'Years employed is required'
      }
    }
    
    if (field === 'annualSalary') {
      if (typeof value === 'number' && value <= 0) {
        return 'Annual salary must be greater than $0'
      }
      if (!value && value !== 0) {
        return 'Annual salary is required'
      }
    }
    
    if (field === 'monthlyIncome') {
      if (typeof value === 'number' && value <= 0) {
        return 'Monthly income must be greater than $0'
      }
      if (!value && value !== 0) {
        return 'Monthly income is required'
      }
    }
    
    return ''
  }

  const handleBlur = (field: keyof EmploymentInfo, value: string | number) => {
    const error = validateField(field, value)
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields first
    const newErrors: Record<string, string> = {}
    const requiredFields: (keyof EmploymentInfo)[] = ['employer', 'position', 'employmentType', 'yearsEmployed', 'annualSalary', 'monthlyIncome']
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field] || '')
      if (error) {
        newErrors[field] = error
      }
    })
    
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
      const validatedData = employmentInfoSchema.parse(formData)
      setEmploymentInfo(validatedData)
      markStepCompleted(2)
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Employment & Income
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Tell us about your employment status and income details.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              All fields are required. Income amounts are automatically synchronized between annual and monthly values.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employer *
            </label>
            <input
              type="text"
              id="employer"
              value={formData.employer}
              onChange={(e) => handleChange('employer', e.target.value)}
              onBlur={(e) => handleBlur('employer', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.employer ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="ABC Company Inc."
            />
            {errors.employer && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.employer}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Position/Title *
            </label>
            <input
              type="text"
              id="position"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              onBlur={(e) => handleBlur('position', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.position ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Software Engineer"
            />
            {errors.position && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.position}</p>
              </div>
            )}
          </div>
        </div>

        {/* Employment Type and Years */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employment Type *
            </label>
            <select
              id="employmentType"
              value={formData.employmentType}
              onChange={(e) => handleChange('employmentType', e.target.value as EmploymentInfo['employmentType'])}
              onBlur={(e) => handleBlur('employmentType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.employmentType ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="self-employed">Self-employed</option>
            </select>
            {errors.employmentType && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.employmentType}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="yearsEmployed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Years Employed *
            </label>
            <input
              type="number"
              id="yearsEmployed"
              min="0"
              max="50"
              step="0.5"
              value={formData.yearsEmployed}
              onChange={(e) => handleChange('yearsEmployed', parseFloat(e.target.value) || 0)}
              onBlur={(e) => handleBlur('yearsEmployed', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.yearsEmployed ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="2.5"
            />
            {errors.yearsEmployed && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.yearsEmployed}</p>
              </div>
            )}
          </div>
        </div>

        {/* Income Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="annualSalary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Annual Salary *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                id="annualSalary"
                min="0"
                step="1000"
                value={formData.annualSalary}
                onChange={(e) => {
                  const annual = parseFloat(e.target.value) || 0
                  handleChange('annualSalary', annual)
                  handleChange('monthlyIncome', Math.round(annual / 12))
                }}
                onBlur={(e) => handleBlur('annualSalary', parseFloat(e.target.value) || 0)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                  errors.annualSalary ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="75000"
              />
            </div>
            {errors.annualSalary && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.annualSalary}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Income *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                id="monthlyIncome"
                min="0"
                step="100"
                value={formData.monthlyIncome}
                onChange={(e) => {
                  const monthly = parseFloat(e.target.value) || 0
                  handleChange('monthlyIncome', monthly)
                  handleChange('annualSalary', monthly * 12)
                }}
                onBlur={(e) => handleBlur('monthlyIncome', parseFloat(e.target.value) || 0)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                  errors.monthlyIncome ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="6250"
              />
            </div>
            {errors.monthlyIncome && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.monthlyIncome}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={previousStep}
            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Back to Personal Info
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
          >
            Continue to Loan Details
          </button>
        </div>
      </form>
    </div>
  )
}