"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"

const ProfileInfo = ({ userInfo, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getInitials = (name) => {
    if (!name) return ""
    const words = name.split(" ")
    let initials = ""
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0]
    }
    return initials.toUpperCase()
  }

  if (!userInfo) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-50 rounded-full pl-2 pr-3 py-1 transition-colors"
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
          {getInitials(userInfo.fullName)}
        </div>
        <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">{userInfo.fullName}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-medium">{userInfo.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{userInfo.email || "No email"}</p>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Your Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={() => {
                onLogout()
                setIsOpen(false)
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileInfo
