// src/pages/Home/Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import FilterBar from '../../components/FilterBar';
import ProjectCard from '../../components/Cards/ProjectCard';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const categoryMap = {
  trending: null,           // no filter
  graphic: 'Graphic Design',
  photography: 'Photography',
  illustration: 'Illustration',
  ui: 'UX/UI',
  motion: 'Motion Graphics'
};

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allProjects, setAllProjects] = useState([]);          // full list
  const [filteredProjects, setFilteredProjects] = useState([]);// filtered list
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
      const { data } = await axiosInstance.get('/projects/projects/all');
      const projects = data.projects || [];
      setAllProjects(projects);
      setFilteredProjects(projects); // initially show all
    } catch (err) {
      console.error('Fetch projects error:', err);
      setError('Could not load projects');
    }
  };

  // Called whenever filter tab changes
  const handleTabChange = (tab) => {
    const category = categoryMap[tab];
    if (!category) {
      // trending or no specific filter
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(
        allProjects.filter((p) => p.categories.includes(category))
      );
    }
  };

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
            {/* Filter bar */}
            <FilterBar onTabChange={handleTabChange} />

            <div className="flex gap-7">
              <div className="flex-1">
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredProjects.map((item) => (
                      <ProjectCard
                        key={item._id}
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

export default Home;
