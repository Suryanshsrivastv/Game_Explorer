import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react'
import { useDispatch } from 'react-redux'
import store from './redux/store'
import { setUserId } from './redux/slices/bookmarksSlice'
import { ThemeProvider } from './context/ThemeContext'
import './styles/theme.css'
import './App.css'

// Pages
import Home from './pages/Home'
import GameDetail from './pages/GameDetail'
import Library from './pages/Library'

// Clerk publishable key - in a real app, this would be stored in an environment variable
// Ensuring proper key format for Clerk authentication
const CLERK_PUBLISHABLE_KEY = 'pk_test_Y29tcGxldGUtbWFnZ290LTM3LmNsZXJrLmFjY291bnRzLmRldiQ='

// Auth wrapper component to sync Clerk user with Redux store
const AuthWrapper = ({ children }) => {
  const { userId, isSignedIn } = useAuth();
  const dispatch = useDispatch();

  // Update Redux store with user ID when auth state changes
  React.useEffect(() => {
    if (isSignedIn && userId) {
      dispatch(setUserId(userId));
    } else if (!isSignedIn) {
      dispatch(setUserId(null));
    }
  }, [isSignedIn, userId, dispatch]);

  return children;
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Provider store={store}>
        <ThemeProvider>
          <Router>
          <AuthWrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game/:id" element={<GameDetail />} />
                <Route path="/library" element={<Library />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AuthWrapper>
          </Router>
        </ThemeProvider>
      </Provider>
    </ClerkProvider>
  )
}

export default App
