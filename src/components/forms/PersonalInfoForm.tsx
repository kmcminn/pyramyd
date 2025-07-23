'use client'

import { useState } from 'react'
import { useApplicationStore } from '@/store/applicationStore'
import { personalInfoSchema, type PersonalInfo } from '@/schemas/applicationSchema'

export default function PersonalInfoForm() {
  const { personalInfo, setPersonalInfo, nextStep, markStepCompleted } = useApplicationStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<Partial<PersonalInfo>>({
    firstName: personalInfo.firstName || '',
    lastName: personalInfo.lastName || '',
    email: personalInfo.email || '',
    phone: personalInfo.phone || '',
    address: personalInfo.address || '',
    city: personalInfo.city || '',
    state: personalInfo.state || '',
    zipCode: personalInfo.zipCode || '',
  })

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateField = (field: keyof PersonalInfo, value: string) => {
    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`
    }
    
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }
    
    if (field === 'phone') {
      const phoneRegex = /^\d{10,}$/
      if (!phoneRegex.test(value.replace(/\D/g, ''))) {
        return 'Phone number must be at least 10 digits'
      }
    }
    
    if (field === 'zipCode') {
      const zipRegex = /^\d{5}(-\d{4})?$/
      if (!zipRegex.test(value)) {
        return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
      }
    }
    
    return ''
  }

  const handleBlur = (field: keyof PersonalInfo, value: string) => {
    const error = validateField(field, value)
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields first
    const newErrors: Record<string, string> = {}
    const requiredFields: (keyof PersonalInfo)[] = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field] || '')
      if (error) {
        newErrors[field] = error
      }
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Flash effect for empty fields - prioritize email field if it has an error
      const errorFields = Object.keys(newErrors)
      const priorityField = errorFields.includes('email') ? 'email' : errorFields[0]
      const firstErrorField = document.getElementById(priorityField)
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
      const validatedData = personalInfoSchema.parse(formData)
      setPersonalInfo(validatedData)
      markStepCompleted(1)
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
          Personal Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Please provide your basic personal details to get started.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              All fields marked with * are required. Fields are validated as you type and when you move to the next field.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onBlur={(e) => handleBlur('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.firstName ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              onBlur={(e) => handleBlur('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.lastName ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={(e) => handleBlur('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={(e) => handleBlur('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Address Fields */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={(e) => handleBlur('address', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
              errors.address ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="123 Main Street"
          />
          {errors.address && (
            <div className="mt-1 flex items-center space-x-1">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">{errors.address}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              onBlur={(e) => handleBlur('city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.city ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="New York"
            />
            {errors.city && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.city}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              State *
            </label>
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              onBlur={(e) => handleBlur('state', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.state ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="NY"
            />
            {errors.state && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.state}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              onBlur={(e) => handleBlur('zipCode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-200 ${
                errors.zipCode ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="12345"
            />
            {errors.zipCode && (
              <div className="mt-1 flex items-center space-x-1">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{errors.zipCode}</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
          >
            Continue to Employment Info
          </button>
        </div>
      </form>
    </div>
  )
}