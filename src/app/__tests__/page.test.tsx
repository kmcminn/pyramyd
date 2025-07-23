import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../page'
import { useApplicationStore } from '@/store/applicationStore'

// Mock the application store
jest.mock('@/store/applicationStore')
const mockUseApplicationStore = useApplicationStore as jest.MockedFunction<typeof useApplicationStore>

// Mock the theme context
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
}))

// Mock the components to avoid dependency issues
jest.mock('@/components/DarkModeToggle', () => {
  return function MockDarkModeToggle() {
    return <div data-testid="dark-mode-toggle">Dark Mode Toggle</div>
  }
})

jest.mock('@/components/ApplicationForm', () => {
  return function MockApplicationForm() {
    return <div data-testid="application-form">Application Form</div>
  }
})

describe('Home Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
  })

  it('renders the home page correctly when form is not started', () => {
    // Mock the store to return form not started
    mockUseApplicationStore.mockReturnValue({
      isFormStarted: false,
      startForm: jest.fn(),
      personalInfo: {},
      employmentInfo: {},
      loanDetails: {},
      currentStep: 1,
      completedSteps: [],
      setPersonalInfo: jest.fn(),
      setEmploymentInfo: jest.fn(),
      setLoanDetails: jest.fn(),
      setCurrentStep: jest.fn(),
      markStepCompleted: jest.fn(),
      resetForm: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
    })

    render(<Home />)

    // Check that the main heading is present
    expect(screen.getByText('Loan Application')).toBeInTheDocument()

    // Check that the navigation bar with logo is present
    expect(screen.getByText('pyramyd')).toBeInTheDocument()

    // Check that the dark mode toggle is present
    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument()

    // Check that the "Start Application" button is present
    expect(screen.getByText('Start Application')).toBeInTheDocument()

    // Check that feature cards are present
    expect(screen.getByText('Personal Info')).toBeInTheDocument()
    expect(screen.getByText('Employment')).toBeInTheDocument()
    expect(screen.getByText('Loan Details')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()

    // Check that benefits are present
    expect(screen.getByText('Secure')).toBeInTheDocument()
    expect(screen.getByText('Fast')).toBeInTheDocument()
    expect(screen.getByText('Flexible')).toBeInTheDocument()

    // Ensure application form is not rendered
    expect(screen.queryByTestId('application-form')).not.toBeInTheDocument()
  })

  it('renders the application form when form is started', async () => {
    // Mock the store to return form started
    mockUseApplicationStore.mockReturnValue({
      isFormStarted: true,
      startForm: jest.fn(),
      personalInfo: {},
      employmentInfo: {},
      loanDetails: {},
      currentStep: 1,
      completedSteps: [],
      setPersonalInfo: jest.fn(),
      setEmploymentInfo: jest.fn(),
      setLoanDetails: jest.fn(),
      setCurrentStep: jest.fn(),
      markStepCompleted: jest.fn(),
      resetForm: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
    })

    render(<Home />)

    // First check that loading state is shown
    expect(screen.getByText('Loading application form...')).toBeInTheDocument()

    // Wait for the dynamic import to complete and application form to load
    await waitFor(() => {
      expect(screen.getByTestId('application-form')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Ensure the home page content is not rendered
    expect(screen.queryByText('Loan Application')).not.toBeInTheDocument()
    expect(screen.queryByText('Start Application')).not.toBeInTheDocument()
  })

  it('calls startForm when Start Application button is clicked', () => {
    const mockStartForm = jest.fn()

    // Mock the store
    mockUseApplicationStore.mockReturnValue({
      isFormStarted: false,
      startForm: mockStartForm,
      personalInfo: {},
      employmentInfo: {},
      loanDetails: {},
      currentStep: 1,
      completedSteps: [],
      setPersonalInfo: jest.fn(),
      setEmploymentInfo: jest.fn(),
      setLoanDetails: jest.fn(),
      setCurrentStep: jest.fn(),
      markStepCompleted: jest.fn(),
      resetForm: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
    })

    render(<Home />)

    // Click the Start Application button
    const startButton = screen.getByText('Start Application')
    fireEvent.click(startButton)

    // Verify that startForm was called
    expect(mockStartForm).toHaveBeenCalledTimes(1)
  })
})