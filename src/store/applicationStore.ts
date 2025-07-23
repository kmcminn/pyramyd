'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { PersonalInfo, EmploymentInfo, LoanDetails, FormStep } from '@/schemas/applicationSchema'

interface ApplicationState {
  // Form data
  personalInfo: Partial<PersonalInfo>
  employmentInfo: Partial<EmploymentInfo>
  loanDetails: Partial<LoanDetails>
  
  // Form state
  currentStep: FormStep
  completedSteps: FormStep[]
  isFormStarted: boolean
  
  // Actions
  setPersonalInfo: (data: Partial<PersonalInfo>) => void
  setEmploymentInfo: (data: Partial<EmploymentInfo>) => void
  setLoanDetails: (data: Partial<LoanDetails>) => void
  setCurrentStep: (step: FormStep) => void
  markStepCompleted: (step: FormStep) => void
  startForm: () => void
  resetForm: () => void
  nextStep: () => void
  previousStep: () => void
}

const initialState = {
  personalInfo: {},
  employmentInfo: {},
  loanDetails: {},
  currentStep: 1 as FormStep,
  completedSteps: [],
  isFormStarted: false,
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setPersonalInfo: (data) => 
        set((state) => ({ 
          personalInfo: { ...state.personalInfo, ...data } 
        })),
      
      setEmploymentInfo: (data) => 
        set((state) => ({ 
          employmentInfo: { ...state.employmentInfo, ...data } 
        })),
      
      setLoanDetails: (data) => 
        set((state) => ({ 
          loanDetails: { ...state.loanDetails, ...data } 
        })),
      
      setCurrentStep: (step) => 
        set({ currentStep: step }),
      
      markStepCompleted: (step) => 
        set((state) => ({
          completedSteps: state.completedSteps.includes(step) 
            ? state.completedSteps 
            : [...state.completedSteps, step]
        })),
      
      startForm: () => 
        set({ isFormStarted: true, currentStep: 1 }),
      
      resetForm: () => 
        set(initialState),
      
      nextStep: () => 
        set((state) => {
          const nextStep = Math.min(state.currentStep + 1, 4) as FormStep
          return { currentStep: nextStep }
        }),
      
      previousStep: () => 
        set((state) => {
          const prevStep = Math.max(state.currentStep - 1, 1) as FormStep
          return { currentStep: prevStep }
        }),
    }),
    {
      name: 'pyramyd-application-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        personalInfo: state.personalInfo,
        employmentInfo: state.employmentInfo,
        loanDetails: state.loanDetails,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        isFormStarted: state.isFormStarted,
      }),
    }
  )
)