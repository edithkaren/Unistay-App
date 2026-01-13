
import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, Check, X, SlidersHorizontal, ArrowUpDown, Map as MapIcon, LayoutGrid } from 'lucide-react';
import { AMENITIES } from '../constants';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: 'grid' | 'map';
  setViewMode: (mode: 'grid' | 'map') => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, viewMode, setViewMode, sortBy, setSortBy }) => {
  const [minPrice, setMinPrice] = useState(filters.budget[0]);
  const [maxPrice, setMaxPrice] = useState(filters.budget[1]);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);

  useEffect(() => {
    setMinPrice(filters.budget[0]);
    setMaxPrice(filters.budget[1]);
  }, [filters.budget]);

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = parseInt(e.target.value);
    if (type === 'min') {
      const newMin = Math.min(value, maxPrice - 500);
      setMinPrice(newMin);
      setFilters(prev => ({ ...prev, budget: [newMin, maxPrice] }));
    } else {
      const newMax = Math.max(value, minPrice + 500);
      setMaxPrice(newMax);
      setFilters(prev => ({ ...prev, budget: [minPrice, newMax] }));
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 py-3 px-4 sticky top-[65px] z-40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Section: Core Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Gender Filter */}
          <div className="relative group">
            <select 
              className="appearance-none bg-gray-50 border border-transparent hover:border-indigo-100 rounded-2xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all pr-9 cursor-pointer text-gray-700"
              value={filters.gender}
              onChange={(e) => setFilters(p => ({ ...p, gender: e.target.value }))}
            >
              <option value="All">All Genders</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Unisex">Unisex</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Property Type Filter */}
          <div className="relative group">
            <select 
              className="appearance-none bg-gray-50 border border-transparent hover:border-indigo-100 rounded-2xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all pr-9 cursor-pointer text-gray-700"
              value={filters.type}
              onChange={(e) => setFilters(p => ({ ...p, type: e.target.value }))}
            >
              <option value="All">All Stays</option>
              <option value="PG">PG</option>
              <option value="Hostel">Hostel</option>
              <option value="Room">Private Room</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-1.5 min-w-[220px]">
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">
                <span>₹{minPrice/1000}k</span>
                <span className="text-indigo-600 font-bold">Budget</span>
                <span>₹{maxPrice/1000}k</span>
              </div>
              <div className="relative h-4 flex items-center">
                <div className="absolute w-full h-1 bg-gray-200 rounded-full"></div>
                <div 
                  className="absolute h-1 bg-indigo-500 rounded-full transition-all duration-300" 
                  style={{ 
                    left: `${(minPrice / 50000) * 100}%`, 
                    right: `${100 - (maxPrice / 50000) * 100}%` 
                  }}
                ></div>
                <input 
                  type="range" min="0" max="50000" step="500" value={minPrice}
                  onChange={(e) => handlePriceChange(e, 'min')}
                  className="absolute w-full appearance-none pointer-events-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <input 
                  type="range" min="0" max="50000" step="500" value={maxPrice}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  className="absolute w-full appearance-none pointer-events-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Amenities Multi-Select Popover */}
          <div className="relative">
            <button 
              onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                filters.amenities.length > 0 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Amenities {filters.amenities.length > 0 && `(${filters.amenities.length})`}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isAmenitiesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAmenitiesOpen && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Amenities</span>
                  {filters.amenities.length > 0 && (
                    <button 
                      onClick={() => setFilters(p => ({ ...p, amenities: [] }))}
                      className="text-[10px] font-bold text-red-500 hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        filters.amenities.includes(amenity)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span>{amenity}</span>
                      {filters.amenities.includes(amenity) && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setIsAmenitiesOpen(false)}
                  className="w-full mt-4 bg-gray-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-black transition-all"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Sort and View Mode */}
        <div className="flex items-center gap-3">
          {/* Sort By Filter */}
          <div className="relative group flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select 
              className="appearance-none bg-transparent border-none text-xs font-bold focus:outline-none transition-all pr-7 cursor-pointer text-gray-700"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Recommended">Sort: Default</option>
              <option value="PriceLowToHigh">Price: Low to High</option>
              <option value="PriceHighToLow">Price: High to Low</option>
              <option value="Rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>

          <div className="h-8 w-px bg-gray-100 mx-1 hidden lg:block"></div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-xl transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={() => setFilters({ city: filters.city, gender: 'All', type: 'All', budget: [0, 50000], amenities: [] })}
            className="text-gray-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors ml-2"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
