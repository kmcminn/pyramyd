import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PersonalInfoForm from '../PersonalInfoForm'
import { useApplicationStore } from '@/store/applicationStore'

// Mock the application store
jest.mock('@/store/applicationStore')
const mockUseApplicationStore = useApplicationStore as jest.MockedFunction<typeof useApplicationStore>

describe('PersonalInfoForm Email Validation', () => {
  const mockSetPersonalInfo = jest.fn()
  const mockMarkStepCompleted = jest.fn()
  const mockNextStep = jest.fn()

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Mock the store with default values
    mockUseApplicationStore.mockReturnValue({
      personalInfo: {},
      setPersonalInfo: mockSetPersonalInfo,
      markStepCompleted: mockMarkStepCompleted,
      nextStep: mockNextStep,
      isFormStarted: true,
      employmentInfo: {},
      loanDetails: {},
      currentStep: 1,
      completedSteps: [],
      startForm: jest.fn(),
      setEmploymentInfo: jest.fn(),
      setLoanDetails: jest.fn(),
      setCurrentStep: jest.fn(),
      resetForm: jest.fn(),
      previousStep: jest.fn(),
    })
  })

  it('renders the email input field', () => {
    render(<PersonalInfoForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('id', 'email')
  })

  it('shows validation error for invalid email format on blur', async () => {
    const user = userEvent.setup()
    render(<PersonalInfoForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    
    // Enter invalid email
    await user.type(emailInput, 'invalid-email')
    await user.tab() // Trigger blur event
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
    
    // Check that the input has error styling
    expect(emailInput).toHaveClass('border-red-500')
  })

  it('shows validation error for empty email on blur', async () => {
    const user = userEvent.setup()
    render(<PersonalInfoForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    
    // Focus and then blur without entering anything
    await user.click(emailInput)
    await user.tab()
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
    
    // Check that the input has error styling
    expect(emailInput).toHaveClass('border-red-500')
  })

  it('clears validation errors when user starts typing', async () => {
    const user = userEvent.setup()
    render(<PersonalInfoForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    
    // First, trigger an error
    await user.type(emailInput, 'invalid-email')
    await user.tab()
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
    
    // Start typing to clear the error
    await user.type(emailInput, 'x')
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
    })
    
    // Input should not have error styling
    expect(emailInput).not.toHaveClass('border-red-500')
  })

  it('accepts valid email addresses', async () => {
    const user = userEvent.setup()
    render(<PersonalInfoForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'firstname.lastname@company.com'
    ]
    
    for (const email of validEmails) {
      // Clear the input
      await user.clear(emailInput)
      
      // Enter valid email
      await user.type(emailInput, email)
      await user.tab()
      
      // Should not show any validation errors
      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument()
      })
      
      // Input should not have error styling
      expect(emailInput).not.toHaveClass('border-red-500')
    }
  })

  it('shows validation error on form submission with invalid email', async () => {
    const user = userEvent.setup()
    render(<PersonalInfoForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByText(/continue to employment info/i)
    
    // Enter invalid email
    await user.type(emailInput, 'invalid-email')
    
    // Try to submit the form
    await user.click(submitButton)
    
    // Should show validation error and not proceed
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
    
    // Should not have called the next step functions
    expect(mockSetPersonalInfo).not.toHaveBeenCalled()
    expect(mockMarkStepCompleted).not.toHaveBeenCalled()
    expect(mockNextStep).not.toHaveBeenCalled()
  })

  it('shows validation error on form submission with empty email', async () => {
    const user = userEvent.setup()
    render(<PersonalInfoForm />)
    
    const submitButton = screen.getByText(/continue to employment info/i)
    
    // Try to submit form without filling email
    await user.click(submitButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
    
    // Should focus on the email input
    const emailInput = screen.getByLabelText(/email address/i)
    expect(emailInput).toHaveFocus()
    
    // Should not proceed to next step
    expect(mockSetPersonalInfo).not.toHaveBeenCalled()
    expect(mockMarkStepCompleted).not.toHaveBeenCalled()
    expect(mockNextStep).not.toHaveBeenCalled()
  })

  it('proceeds to next step with valid email and other required fields', async () => {
    const user = userEvent.setup()
    render(<PersonalInfoForm />)
    
    // Fill in all required fields with valid data
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/phone number/i), '1234567890')
    await user.type(screen.getByLabelText(/street address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/state/i), 'NY')
    await user.type(screen.getByLabelText(/zip code/i), '10001')
    
    // Submit the form
    const submitButton = screen.getByText(/continue to employment info/i)
    await user.click(submitButton)
    
    // Should proceed to next step
    await waitFor(() => {
      expect(mockSetPersonalInfo).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      })
      expect(mockMarkStepCompleted).toHaveBeenCalledWith(1)
      expect(mockNextStep).toHaveBeenCalled()
    })
  })
})