
import React from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { CITIES } from '../constants';

interface HeroProps {
  onSearch: (city: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [selectedCity, setSelectedCity] = React.useState('');

  const handleSearch = () => {
    if (selectedCity) onSearch(selectedCity);
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Your Home Away <br className="hidden md:block" /> From Home
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
          Discover the best-rated PGs, Hostels, and Shared Rooms across India's top student cities. Verified properties, zero brokerage.
        </p>

        <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2 max-w-2xl mx-auto">
          <div className="flex-1 flex items-center px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-100">
            <MapPin className="text-gray-400 w-5 h-5 mr-3" />
            <select 
              className="w-full bg-transparent text-gray-700 focus:outline-none appearance-none"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Select City</option>
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <Search className="w-5 h-5" />
            <span>Find Rooms</span>
          </button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-white/80 text-sm font-medium">
          <span>Popular:</span>
          {['Bangalore', 'Delhi', 'Mumbai'].map(city => (
            <button 
              key={city}
              onClick={() => onSearch(city)}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Decorative shapes */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Hero;
