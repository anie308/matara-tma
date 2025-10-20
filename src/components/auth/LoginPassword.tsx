import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { setIsAuthenticated } from '../../services/redux/user';
import { toast } from 'react-hot-toast';
import { useLoginMutation } from '../../services/auth';

interface LoginPasswordProps {
  onSuccess: () => void;
}

const LoginPassword: React.FC<LoginPasswordProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.user.profile);
  const username = profile?.username;
  
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      toast.error('Username not found');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      const result = await login({ username, password }).unwrap();

      // Store JWT token
      if (result.token) {
        localStorage.setItem('jwt_token', result.token);
      }
      
      dispatch(setIsAuthenticated(true));
      toast.success('Login successful!');
      onSuccess();
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error?.data?.message || 'Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#FFB948] to-[#44F58E] rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Enter your password to continue</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-[#FFB948]" />
            <span className="text-white font-medium">{username}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB948] focus:border-transparent"
                placeholder="Enter your password"
                required
                autoFocus
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-gradient-to-r from-[#FFB948] to-[#44F58E] text-black font-semibold py-3 px-4 rounded-lg hover:from-[#FFA500] hover:to-[#3DDC84] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Forgot your password? Contact support for assistance
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPassword;
