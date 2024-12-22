import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ChatLayout } from './components/chat/ChatLayout';
import { useAuthStore } from './stores/authStore';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
              <div className="w-full max-w-md space-y-8 rounde d-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Or{' '}
                    <a
                      href="/register"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      create a new account
                    </a>
                  </p>
                </div>
                <LoginForm />
              </div>
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
              <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Create your account
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Already have an account?{' '}
                    <a
                      href="/login"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
                <RegisterForm />
              </div>
            </div>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatLayout />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/chat" />} />
      </Routes>
    </Router>
  );
}

export default App;