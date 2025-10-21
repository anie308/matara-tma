import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { setIsAuthenticated, setHasPassword } from '../../services/redux/user';
import { toast } from 'react-hot-toast';
import { useCreatePasswordMutation } from '../../services/auth';

interface CreatePasswordProps {
  onSuccess: () => void;
}

const CreatePassword: React.FC<CreatePasswordProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.user.profile);
  const username = profile?.username;
  
  const [createPassword, { isLoading }] = useCreatePasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      toast.error('Username not found');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const result = await createPassword({ username, password }).unwrap();

      // Store JWT token if provided
      if (result.token) {
        localStorage.setItem('jwt_token', result.token);
      }
      
      dispatch(setHasPassword(true));
      dispatch(setIsAuthenticated(true));
      toast.success('Password created successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating password:', error);
      toast.error(error?.data?.message || 'Failed to create password');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#FFB948] to-[#44F58E] rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Your Password</h1>
          <p className="text-gray-400">Secure your account with a password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB948] focus:border-transparent"
                placeholder="Enter your password"
                required
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB948] focus:border-transparent"
                placeholder="Confirm your password"
                required
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full btn text-black font-semibold py-3 px-4 rounded-lg  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? 'Creating Password...' : 'Create Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your password is encrypted and stored securely
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
