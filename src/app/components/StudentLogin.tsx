import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigation } from '@/app/context/NavigationContext';

export function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { navigateTo } = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigateTo('student-dashboard');
    } else {
      setError(result.message || 'Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl text-gray-900">
          Student Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your alumni account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-600 focus:border-green-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-600 focus:border-green-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-sm text-center space-y-2">
              <div>
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => navigateTo('student-register')}
                  className="text-green-600 hover:text-green-700"
                >
                  Register here
                </button>
              </div>
              <div>
                <span className="text-gray-600">Admin? </span>
                <button
                  type="button"
                  onClick={() => navigateTo('admin-login')}
                  className="text-green-600 hover:text-green-700"
                >
                  Sign in as admin
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900 text-center">
                <strong>Demo Admin Account:</strong>
                <br />
                <span className="text-xs">Email: admin@bits.edu | Password: admin123</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
