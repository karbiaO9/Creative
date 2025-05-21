"use client"

const CategoryFilter = ({ onFilterChange, activeCategory }) => {
  const categories = [
    { id: "all", name: "All Projects" },
    { id: "UX/UI", name: "UX/UI" },
    { id: "Web Design", name: "Web Design" },
    { id: "Logo Design", name: "Logo Design" },
    { id: "3D Art", name: "3D Art" },
    { id: "Motion Graphics", name: "Motion Graphics" },
    { id: "Illustration", name: "Illustration" },
    { id: "Branding", name: "Branding" },
    { id: "Mobile App Design", name: "Mobile App Design" },
  ]

  return (
    <div className="mb-8 overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
