import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import EditProjectForm from "../../components/EditProjectForm";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // 1) Auth & role check
        const { data: auth } = await axiosInstance.get("/auth/get-user");
        setUserInfo(auth.user);
        if (auth.user.role !== "designer") {
          alert("Only designers can edit projects");
          return navigate("/");
        }

        // 2) Fetch the project by id
        const { data: projRes } = await axiosInstance.get(
          `/projects/${id}`
        );
        setProject(projRes.project);
      } catch (err) {
        console.error("EditProject load error:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load project. Try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar userInfo={userInfo} />
        <div className="container mx-auto px-4 py-16 text-center text-red-600">
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto px-4 py-8">
        <EditProjectForm
          project={project}        // pass initial data
          onSuccess={() => navigate("/projects/" + id)}
          onCancel={() => navigate(-1)}
        />
      </div>
    </>
  );
};

export default EditProject;
