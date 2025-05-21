import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Palette } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="bg-white/90 backdrop-blur-md shadow-lg shadow-slate-300 rounded-xl p-12 w-full max-w-xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Join Us</h2>
        <p className="mb-8 font-semibold text-gray-600">Choose your role to create your account</p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate('/signup-designer')}
            className="flex flex-col items-center border-2 border-dashed rounded-lg p-6 hover:border-[#05B6D3] transition-colors"
          >
            <Palette className="h-10 w-10 text-[#05B6D3]" />
            <span className="mt-2 text-lg font-medium text-gray-900">I'm a Designer</span>
            <span className="text-sm text-gray-500 mt-1">Showcase your work and get hired</span>
          </button>

          <button
            onClick={() => navigate('/signup-client')}
            className="flex flex-col items-center border-2 border-dashed rounded-lg p-6 hover:border-[#EF863E] transition-colors"
          >
            <Briefcase className="h-10 w-10 text-[#EF863E]" />
            <span className="mt-2 text-lg font-medium text-gray-900">I'm a Client</span>
            <span className="text-sm text-gray-500 mt-1">Hire talented designers</span>
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="font-medium text-[#05B6D3] hover:text-[#049cb5]">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
