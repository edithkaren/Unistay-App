
import React, { useState } from 'react';
import { Star, MapPin, Heart, CheckCircle, Share2, PlayCircle, StarHalf, MessageCircle, Copy, Check } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onView: (p: Property) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  userDistance?: string;
}

export const RatingStars: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="text-yellow-400 fill-current" />
      ))}
      {hasHalfStar && <StarHalf size={size} className="text-yellow-400 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300" />
      ))}
    </div>
  );
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onView, isWishlisted, onToggleWishlist, userDistance }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const getPropertyUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?propId=${property.id}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getPropertyUrl();
    const text = encodeURIComponent(
      `Hi! Check out this stay at UniStay:\n\n🏡 *${property.name}*\n📍 ${property.locality}, ${property.city}\n💰 Rent: ₹${property.price}/mo\n\nView details here: ${url}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getPropertyUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShareMenu(false);
    }, 1500);
  };

  return (
    <div 
      role="article"
      className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group flex flex-col h-full relative"
    >
      <div 
        className="relative h-64 overflow-hidden cursor-pointer" 
        onClick={() => onView(property)}
        onKeyDown={(e) => e.key === 'Enter' && onView(property)}
        tabIndex={0}
      >
        <img 
          src={property.images[0]} 
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md ${
            property.gender === 'Boys' ? 'bg-blue-600/80' : property.gender === 'Girls' ? 'bg-pink-600/80' : 'bg-indigo-600/80'
          }`}>
            {property.gender} Only
          </span>
          {property.verified && (
            <span className="bg-green-600/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-md w-fit flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(property.id);
            }}
            className={`p-2.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-90 ${
              isWishlisted ? 'bg-white text-red-500' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-gray-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowShareMenu(!showShareMenu);
              }}
              className="p-2.5 rounded-full shadow-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-110 active:scale-90"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {showShareMenu && (
              <div className="absolute top-0 right-full mr-3 w-44 bg-white/95 backdrop-blur-xl border border-indigo-100 rounded-2xl shadow-2xl p-2 z-[60] animate-in slide-in-from-right-2">
                <button 
                  onClick={handleWhatsApp}
                  className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-green-50 text-gray-700 transition-colors"
                >
                  <div className="bg-[#25D366] text-white p-1.5 rounded-lg">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black">WhatsApp</span>
                </button>
                <button 
                  onClick={handleCopy}
                  className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-50 text-gray-700 transition-colors"
                >
                  <div className={`${copied ? 'bg-green-600' : 'bg-indigo-600'} text-white p-1.5 rounded-lg transition-colors`}>
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-black">{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {property.videoTourUrl && (
          <div className="absolute bottom-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl animate-pulse">
            <PlayCircle className="w-4 h-4" />
            Live Tour
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-gray-900/40 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20">
          <RatingStars rating={property.rating} size={14} />
          <span className="text-sm font-black text-white ml-1">{property.rating}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
          {property.name}
        </h3>

        <div className="flex items-center text-gray-400 font-medium text-xs mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-400" />
          {property.locality}, {property.city}
          {userDistance && (
            <span className="ml-2 text-indigo-500 font-bold">• {userDistance} from you</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {property.amenities.slice(0, 3).map(amenity => (
            <span key={amenity} className="flex items-center gap-1.5 bg-indigo-50/50 text-indigo-700 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-indigo-100">
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-black text-gray-900">₹{property.price}</span>
            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-tighter">per month</span>
          </div>
          <button 
            onClick={() => onView(property)}
            className="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
