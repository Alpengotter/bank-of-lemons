describe('Login Form', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/login')
  })

  it('displays the login form with all elements', () => {
    // Check if main elements are present
    cy.get('.login-view').should('exist')
    cy.get('.login-form').should('exist')
    cy.get('.title').should('contain', 'Авторизация')
    cy.get('input[type="text"]').should('have.attr', 'placeholder', 'email')
    cy.get('input[type="password"]').should('have.attr', 'placeholder', 'password')
    cy.get('button[type="submit"]').should('contain', 'Войти')
  })

  it('requires email and password fields', () => {
    // Try to submit empty form
    cy.get('button[type="submit"]').click()

    // Check HTML5 validation
    cy.get('input[type="text"]')
      .invoke('prop', 'validity')
      .should('have.property', 'valueMissing', true)
  })

  it('shows error for invalid email format', () => {
    // Type invalid email
    cy.get('input[type="text"]').type('invalid-email')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Check error message
    cy.get('.input-error').should('contain', 'Неверный формат email')
  })

  it('shows error for incorrect credentials', () => {
    // Intercept API call
    cy.intercept('POST', '/api/v1/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginRequest')

    // Type credentials and submit
    cy.get('input[type="text"]').type('wrong@zarplata.ru')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()

    // Wait for API response
    cy.wait('@loginRequest')

    // Check error message
    cy.get('.input-error').should('contain', 'Неверное имя пользователя или пароль')
  })

  it('handles server timeout', () => {
    // Intercept API call with timeout
    cy.intercept('POST', '/api/v1/login', (req) => {
      req.on('response', (res) => {
        res.setDelay(10000) // Simulate timeout
      })
    }).as('loginRequest')

    // Type credentials and submit
    cy.get('input[type="text"]').type('test@zarplata.ru')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Check error message
    cy.get('.input-error').should('contain', 'Превышено время ожидания запроса')
  })

  it('handles successful login', () => {
    // Intercept API call
    cy.intercept('POST', '/api/v1/login', {
      statusCode: 200,
      body: { accessToken: 'fake-token-123' },
    }).as('loginRequest')

    // Type valid credentials
    cy.get('input[type="text"]').type('valid@zarplata.ru')
    cy.get('input[type="password"]').type('correctpassword')

    // Submit form
    cy.get('button[type="submit"]').click()

    // Wait for API response
    cy.wait('@loginRequest')

    // Verify redirect to home page
    cy.url().should('include', '/') // Assuming home route is '/'

    // Verify token is stored in localStorage
    cy.window().its('localStorage').invoke('getItem', 'token').should('equal', 'fake-token-123')
  })

  it('shows loading state during API call', () => {
    // Intercept API call with delay
    cy.intercept('POST', '/api/v1/login', (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: { accessToken: 'fake-token-123' },
      })
    }).as('loginRequest')

    // Submit form
    cy.get('input[type="text"]').type('test@zarplata.ru')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Check loading state
    cy.get('button[type="submit"]').should('have.class', 'disabled')

    // Wait for request to complete
    cy.wait('@loginRequest')
  })

  it('handles network errors', () => {
    // Simulate network failure
    cy.intercept('POST', '/api/v1/login', {
      forceNetworkError: true,
    }).as('loginRequest')

    // Submit form
    cy.get('input[type="text"]').type('test@zarplata.ru')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Check error message
    cy.get('.input-error').should('contain', 'Ошибка соединения с сервером')
  })
})
