# openForex

A React-based foreign exchange application that simulates a complete FX transaction flow.

## How to Run the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

The app will be available at `http://localhost:5173` by default.

## Key Design Decisions

- **Component Architecture**: Three-screen flow (Quote → Payment → Status) with clear separation of concerns
- **State Management**: Local React state with hooks for simplicity and maintainability
- **API Simulation**: In-memory storage with realistic delays and failure rates for testing
- **Real-time Updates**: Custom polling hook with countdown timers for transaction status tracking
- **Error Handling**: Error boundaries and user-friendly error messages throughout the flow
- **Quote Expiry**: Time-based expiration (30 seconds) with countdown indicators to prevent stale quotes
- **Currency Management**: Centralized currency constants and validation for consistency

## What You Would Improve with More Time

- **Routing**: Implement React Router for better navigation and deep linking capabilities
- **Authentication**: Add user authentication and session management
- **Persistency**: Local storage for user preferences and transaction history
- **Performance**: Virtualization for long lists and memoization optimizations
- **Testing**: E2E testing with Playwright/Cypress for comprehensive coverage
- **Accessibility**: WCAG compliance improvements and better keyboard navigation
- **Internationalization**: Multi-language support for global users
- **Security**: Enhanced input validation and XSS protection
- **Monitoring**: Error tracking and performance monitoring integration