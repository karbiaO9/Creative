import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './../assets/logo.png';
import ProfileInfo from './Cards/ProfileInfo';
import { Search, Bell, MessageSquare, Menu, X } from 'lucide-react';

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isToken = localStorage.getItem('token');

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-6 py-2">
        {/* Logo & Links */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Design Market" className="h-12 w-auto" />
            <span className="ml-2 text-xl font-bold text-gray-800">CREATIVE</span>
          </Link>
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/discover" className="text-gray-700 hover:text-gray-900 font-medium">Discover</Link>
            <Link to="/projects" className="text-gray-700 hover:text-gray-900 font-medium">Projects</Link>
            <Link to="/hire" className="text-gray-700 hover:text-gray-900 font-medium">Hire</Link>
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <MessageSquare className="w-5 h-5" />
          </button>
           {isToken && <ProfileInfo userInfo={userInfo}  onLogout={onLogout}/>}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col p-4 space-y-3">
            <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/discover" className="text-gray-700 hover:text-gray-900">Discover</Link>
            <Link to="/projects" className="text-gray-700 hover:text-gray-900">Projects</Link>
            <Link to="/hire" className="text-gray-700 hover:text-gray-900">Hire</Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {token && (
              <button onClick={handleLogout} className="text-sm text-gray-700 hover:text-gray-900 underline">
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
