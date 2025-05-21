// src/components/FilterBar.jsx
import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

export default function FilterBar({ onTabChange }) {
  const [activeTab, setActiveTab] = useState('trending');

  const tabs = [
    { value: 'trending', label: 'Trending' },
    { value: 'graphic', label: 'Graphic Design' },
    { value: 'photography', label: 'Photography' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'ui', label: 'UI/UX' },
    { value: 'motion', label: 'Motion' },
  ];

  const curatedOptions = [
    'Curated',
    'Featured',
    'Most Appreciated',
    'Most Viewed',
    'Most Discussed',
    'Most Recent',
  ];

  return (
    <div className="mb-8">
      {/* Heading + Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Discover Projects</h1>
        <div className="flex items-center gap-2">
          {/* Filters button */}
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Curated dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-100"
            >
              Curated
              <ChevronDown className="w-4 h-4" />
            </button>
            <select
              onChange={e => console.log('Selected', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              {curatedOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-1 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              onTabChange?.(tab.value);
            }}
            className={`w-full text-sm py-2 rounded-md transition ${
              activeTab === tab.value
                ? 'bg-white shadow-sm font-medium'
                : 'text-gray-700 hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
