"use client"

import { useState } from "react"
import { Heart, Bookmark, Share2, Edit } from "lucide-react"
import { Link, Navigate, useNavigate } from "react-router-dom"

const MyProjectCard = ({
  id,
  title,
  description,
  attachments = [],
  categories = [],
  likesCount = 0,
  designerInfo = {},
  createdAt,
  isLiked = false,
  onLike,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate();   

  const cover = attachments[0] || ""
  const designerName = designerInfo.fullName || "Unknown Designer"
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Placeholder colors for categories
  const categoryColors = {
    "UX/UI": "bg-blue-100 text-blue-700",
    "Web Design": "bg-indigo-100 text-indigo-700",
    "Logo Design": "bg-purple-100 text-purple-700",
    "3D Art": "bg-orange-100 text-orange-700",
    "Motion Graphics": "bg-green-100 text-green-700",
    Illustration: "bg-pink-100 text-pink-700",
    Branding: "bg-yellow-100 text-yellow-700",
    "Mobile App Design": "bg-teal-100 text-teal-700",
  }

  const handleLikeClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onLike) onLike(id)
  }

  return (
    <Link
      to={`/project/${id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl shadow-slate-900 hover:shadow-md transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          {cover ? (
            <>
              <div
                className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${imageLoaded ? "hidden" : "block"}`}
              >
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <img
                src={cover || "/placeholder.svg"}
                alt={title}
                className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"} ${imageLoaded ? "block" : "invisible"}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No Image Available
            </div>
          )}

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4`}
          >
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <button onClick={e => {
                  e.preventDefault();
                  navigate(`/projects/${id}`);
                }}>
                  <Edit className="w-4 h-4" />
                </button>

            </div>
            <div className="flex justify-between items-center">
            
              <div className="flex gap-1">
                {categories.slice(0, 2).map((cat) => (
                  <span key={cat} className={`text-xs px-2 py-1 rounded-full text-white bg-white/20 backdrop-blur-sm`}>
                    {cat}
                  </span>
                ))}
                {categories.length > 2 && (
                  <span className="text-xs px-2 py-1 rounded-full text-white bg-white/20 backdrop-blur-sm">
                    +{categories.length - 2}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-grow">{description}</p>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                  {designerInfo.fullName ? getInitials(designerInfo.fullName) : "U"}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">{designerName}</p>
                  <p className="text-xs text-gray-500">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLikeClick}
                  className={`flex items-center gap-1 text-xs ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
                >
                  <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                  <span>{likesCount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Helper function for getting initials
function getInitials(name) {
  if (!name) return ""
  const words = name.split(" ")
  let initials = ""
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0]
  }
  return initials.toUpperCase()
}

export default MyProjectCard
