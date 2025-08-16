import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface AccessControlProps {
  children: React.ReactNode;
}

const DashboardAccessControl: React.FC<AccessControlProps> = ({ children }) => {
  const [accessKey, setAccessKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const requiredAccessKey = import.meta.env.VITE_DASHBOARD_ACCESS_KEY;

  useEffect(() => {
    // Check if user is already authenticated (stored in sessionStorage)
    const storedAuth = sessionStorage.getItem('dashboard_authenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!requiredAccessKey) {
      setError('Dashboard access key not configured. Contact administrator.');
      return;
    }

    if (accessKey === requiredAccessKey) {
      setIsAuthenticated(true);
      sessionStorage.setItem('dashboard_authenticated', 'true');
    } else {
      setError('Invalid access key. Please try again.');
      setAccessKey('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dashboard_authenticated');
    setAccessKey('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Access</h2>
            <p className="text-gray-600 mt-2">Enter your access key to view the payments dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="accessKey" className="block text-sm font-medium text-gray-700 mb-2">
                Access Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="accessKey"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                  placeholder="Enter access key"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Contact administrator if you need access to this dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Logout button in top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
};

export default DashboardAccessControl;
