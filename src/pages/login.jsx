import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New error state
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch('https://products-api.cbc-apps.net/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber, password: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const authData = await response.json();
      localStorage.setItem('token', authData.access_token);
      navigate('/');
    } catch (e) {
      console.error('Login error:', e);
      setError(e.message); // Set the error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#5E54F2]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F97316]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] bg-clip-text text-transparent mb-2">CBC - WAREHOUSE</h1>
          <p className="text-[#94A3B8]">Welcome back! Please login to your account.</p>
        </div>

        <div className="bg-[#1A1A1A]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-8 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2] transition-all"
                  placeholder="0123456789"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none focus:ring-1 focus:ring-[#5E54F2] transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" disabled={loading}>
                  <svg className="w-5 h-5 text-[#94A3B8] hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 bg-[#0F0F0F] border-white/10 rounded text-[#5E54F2] focus:ring-[#5E54F2] focus:ring-offset-0" disabled={loading} />
                <span className="ml-2 text-sm text-[#94A3B8]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#F97316] hover:text-[#EA580C] transition-colors" disabled={loading}>Forgot password?</a>
            </div>
            
            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-[#5E54F2] to-[#7C3AED] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#5E54F2]/25 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>

        <p className="text-center mt-6 text-[#94A3B8]">
          can't login?
          <a href="#" className="text-[#F97316] hover:text-[#EA580C] font-medium transition-colors">contact us</a>
        </p>
      </div>
    </div>
  );
};

export default Login;