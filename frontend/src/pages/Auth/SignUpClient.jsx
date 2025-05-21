import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/input/PasswordInput';

const SignUpClient = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center h-screen overflow-hidden">
      <div className="max-w-6xl h-[80vh] mx-auto flex rounded-lg shadow-lg overflow-hidden bg-white/95 backdrop-blur-md">
        {/* Left Panel */}
        <div className="w-1/2 h-full bg-signupC-bg-img bg-cover bg-center flex items-end p-10">
          <div className="text-white mr-96">
            <h4 className="text-4xl md:text-6xl font-semibold leading-tight">
              Find Your <br />Perfect Designer.
            </h4>
            <p className="text-lg md:text-1xl mt-2 pr-4 leading-relaxed">
              Browse portfolios and hire with confidence.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-[#e0dad837] p-10 md:p-16 flex items-center">
          <form className="w-full">
            <h4 className="text-5xl text-center font-semibold mb-7">Sign Up as Client</h4>
            <input type="text" placeholder="Full Name" className="input-box" />
            <input type="email" placeholder="Email" className="input-box" />
            <PasswordInput />
            <input type="text" placeholder="Links (comma separated)" className="input-box" />
            <button type="submit" className="btn-primary">Sign Up</button>
            <p className="text-center text-xs text-gray-600 my-4">Already have an account?</p>
            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpClient;