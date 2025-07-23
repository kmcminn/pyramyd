import { z } from 'zod'

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 digits'),
})

export const employmentInfoSchema = z.object({
  employer: z.string().min(1, 'Employer is required'),
  position: z.string().min(1, 'Position is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'self-employed']),
  yearsEmployed: z.number().min(0, 'Years employed must be 0 or greater'),
  annualSalary: z.number().min(0, 'Annual salary must be 0 or greater'),
  monthlyIncome: z.number().min(0, 'Monthly income must be 0 or greater'),
})

export const loanDetailsSchema = z.object({
  loanAmount: z.number().min(1000, 'Loan amount must be at least $1,000'),
  loanPurpose: z.enum([
    'home-purchase',
    'home-refinance',
    'debt-consolidation',
    'business',
    'education',
    'personal',
    'other'
  ]),
  loanTerm: z.number().min(12, 'Loan term must be at least 12 months').max(360, 'Loan term cannot exceed 360 months'),
  downPayment: z.number().min(1, 'Down payment must be greater than $0').optional(),
})

export const applicationSchema = z.object({
  personalInfo: personalInfoSchema,
  employmentInfo: employmentInfoSchema,
  loanDetails: loanDetailsSchema,
  submittedAt: z.date().optional(),
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type EmploymentInfo = z.infer<typeof employmentInfoSchema>
export type LoanDetails = z.infer<typeof loanDetailsSchema>
export type Application = z.infer<typeof applicationSchema>

export type FormStep = 1 | 2 | 3 | 4