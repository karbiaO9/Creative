// src/pages/Home/Home.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MyProjectCard from '../components/Cards/MyProjectCard';



const Profile = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [projects, setProjects] = useState([]);          
  const [error, setError] = useState(null);

  // Fetch user info
  const getUserInfo = async () => {
    try {
      const { data } = await axiosInstance.get('/auth/get-user');
      setUserInfo(data.user);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  // Fetch all projects once
  const getAllProjects = async () => {
    try {
      const response = await axiosInstance.get('/projects/all');
      if (response.data && response.data.projects) {
        setProjects(response.data.projects || []);
      }
    } catch (err) {
      console.error('Fetch projects error:', err);
      setError('Could not load projects');
    }

  }

  

  // Initial load
  useEffect(() => {
    getUserInfo();
    getAllProjects();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      {/* Override body bg on Home */}
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-10">
          <div className="container mx-auto py-10">
           
            <div className="flex gap-7">
              <div className="flex-1">
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {projects.map((item) => (
                      <MyProjectCard
                        key={item._id}
                        id={item._id} 
                        title={item.title}
                        description={item.description}
                        attachments={item.attachmentsUrls}
                        categories={item.categories}
                        likesCount={item.likes.length}
                        designerInfo={item.designerInfo}
                        createdAt={item.createdAt}
                      />
                    ))}
                  
                  </div>
                ) : (
                  <p className="text-center text-gray-600">
                    {error || 'No projects to display.'}
                  </p>
                )}
              </div>
              <div className="w-[320px]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
