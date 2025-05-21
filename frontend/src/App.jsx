import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import SignUpClient from "./pages/Auth/SignUpClient"

import SignUpDesigner from "./pages/Auth/SignUpDesigner"
import AddProject from './pages/Project/AddProject';
import Profile from './pages/Profile';
import EditProject from './pages/Project/EditProject'

const App = () => {
  return (
    <div >
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup-client" element={<SignUpClient />} />
          <Route path="/signup-designer" element={<SignUpDesigner />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects/:id" element={<EditProject />} />

          
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
  