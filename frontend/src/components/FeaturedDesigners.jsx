import { Link } from "react-router-dom"
import { ExternalLink } from "lucide-react"

const FeaturedDesigners = ({ designers = [] }) => {
  // Sample designers if none provided
  const sampleDesigners =
    designers.length > 0
      ? designers
      : [
          { id: "1", fullName: "Sarah Johnson", role: "UI/UX Designer", projectCount: 24 },
          { id: "2", fullName: "Michael Chen", role: "Brand Designer", projectCount: 18 },
          { id: "3", fullName: "Emma Wilson", role: "Illustrator", projectCount: 32 },
          { id: "4", fullName: "David Park", role: "3D Artist", projectCount: 15 },
          { id: "5", fullName: "Olivia Martinez", role: "Motion Designer", projectCount: 27 },
        ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Featured Designers</h3>
        <Link to="/designers" className="text-primary text-sm font-medium hover:underline">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {sampleDesigners.map((designer, index) => (
          <Link
            key={designer.id || index}
            to={`/designer/${designer.id}`}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                {getInitials(designer.fullName)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{designer.fullName}</h4>
                <p className="text-xs text-gray-500">{designer.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                {designer.projectCount} projects
              </span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <Link
          to="/become-designer"
          className="block w-full py-2 text-center text-primary border border-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors"
        >
          Become a Designer
        </Link>
      </div>
    </div>
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

export default FeaturedDesigners
