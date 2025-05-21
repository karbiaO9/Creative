"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AddProjectForm from "../../components/AddProjectForm"
import Navbar from "../../components/Navbar"
import axiosInstance from '../../utils/axiosInstance';


const AddProject = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in and is a designer
  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get("/auth/get-user")
        const user = response.data.user

        setUserInfo(user)

        // Check if user is a designer
        if (user.role !== "designer") {
          navigate("/")
          alert("Only designers can upload projects")
        }
      } catch (err) {
        console.error("Auth error:", err)
        localStorage.clear()
        navigate("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAccess()
  }, [navigate])

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto px-4 py-8">
        <AddProjectForm />
      </div>
    </>
  )
}

export default AddProject
