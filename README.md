# LinkedNet (CoffeeChat)

LinkedNet is a networking app that facilitates meaningful connections between existing LinkedIn contacts. Instead of random matching like LunchClub, LinkedNet pairs users with people already in their professional network, turning dormant connections into active relationships through structured meetups.

## Project Structure

This project has been structured for optimal performance and maintainability:

```
src/
  components/        # UI components
  context/           # React Context API for state management
  data/              # Sample data and mock API responses
  hooks/             # Custom React hooks for business logic
  App.js             # Main application with lazy loading
  index.js           # Entry point
```

## Performance Optimizations

- **Code-splitting** with React.lazy and Suspense
- **Memoization** with React.memo, useMemo, and useCallback
- **Component extraction** for better reusability and performance
- **Context API** for efficient state management
- **Custom hooks** for separating business logic from UI

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

## Key Features

- Dashboard with networking stats
- Discovery of dormant connections
- Personalized reconnection messages
- Scheduling and meeting coordination
- Relationship intelligence

## Technologies Used

- React 18
- TailwindCSS
- Lucide React for icons
- React Context API for state management
