"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { X, Upload, Loader2, AlertCircle, Check } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"

const AddProjectForm = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [files, setFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Available categories from your model
  const availableCategories = [
    "UX/UI",
    "Web Design",
    "Logo Design",
    "3D Art",
    "Motion Graphics",
    "Illustration",
    "Branding",
    "Mobile App Design",
  ]

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files
    handleFiles(selectedFiles)
  }

  // Process selected files
  const handleFiles = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const newFiles = [...files]
    const newPreviewUrls = [...previewUrls]

    Array.from(selectedFiles).forEach((file) => {
      // Only accept images and videos
      if (!file.type.match("image.*") && !file.type.match("video.*")) return

      newFiles.push(file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      newPreviewUrls.push({
        url: previewUrl,
        type: file.type.startsWith("image") ? "image" : "video",
        name: file.name,
      })
    })

    setFiles(newFiles)
    setPreviewUrls(newPreviewUrls)
  }

  // Remove a file from the selection
  const removeFile = (index) => {
    const newFiles = [...files]
    const newPreviewUrls = [...previewUrls]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index].url)

    newFiles.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setFiles(newFiles)
    setPreviewUrls(newPreviewUrls)
  }

  // Toggle category selection
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      setError("Title is required")
      return false
    }

    if (!description.trim()) {
      setError("Description is required")
      return false
    }

    if (selectedCategories.length === 0) {
      setError("Please select at least one category")
      return false
    }

    if (files.length === 0) {
      setError("Please upload at least one image or video")
      return false
    }

    return true
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // First, upload all files to get URLs
      const uploadedUrls = await uploadFiles()

      // Then create the project with the uploaded URLs
      await createProject(uploadedUrls)

      setSuccess(true)

      // Reset form
      setTitle("")
      setDescription("")
      setSelectedCategories([])

      // Clean up preview URLs
      previewUrls.forEach((preview) => URL.revokeObjectURL(preview.url))
      setFiles([])
      setPreviewUrls([])

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (err) {
      console.error("Project upload error:", err)
      setError(err.response?.data?.message || "Failed to upload project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Upload files to server
  const uploadFiles = async () => {
    if (files.length === 0) return []

    // Build a single FormData with all files
    const formData = new FormData()
    files.forEach(file => formData.append("files", file))

    const response = await axiosInstance.post("/file-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    // response.data.files is an array of URLs for exactly the files you sent
    return response.data.files || []
  }

  // Create project with uploaded file URLs
  const createProject = async (attachmentsUrls) => {
    const projectData = {
      title,
      description,
      categories: selectedCategories,
      attachmentsUrls,
    }

    await axiosInstance.post("/projects/add", projectData)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Upload New Project</h1>
        <p className="text-gray-600">Share your creative work with CREATIVE community</p>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
          <Check className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">Project uploaded successfully! Redirecting...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Enter a descriptive title for your project"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Describe your project, process, and inspiration"
              required
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategories.includes(category)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">Select all that apply</p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images/Videos <span className="text-red-500">*</span>
            </label>

            {/* Drag & Drop area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"
                }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-gray-700 mb-1">Drag and drop files here, or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-primary font-medium hover:underline"
                >
                  Browse files
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: JPG, PNG, GIF, MP4, WebM (max 10MB each)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Preview area */}
            {previewUrls.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {previewUrls.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {preview.type === "image" ? (
                          <img
                            src={preview.url || "/placeholder.svg"}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                            <span className="text-xs">Video</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm"
                      >
                        <X className="w-4 h-4 text-gray-700" />
                      </button>
                      <p className="mt-1 text-xs text-gray-500 truncate">{preview.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Project"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddProjectForm
