
import React from 'react';
import { Building2, Heart, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  wishlistCount: number;
  currentPage: string;
  onNavigate: (page: any) => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ wishlistCount, currentPage, onNavigate, user, onLoginClick, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-gradient-to-tr from-indigo-600 to-violet-500 p-2.5 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-indigo-100">
              <Building2 className="text-white w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-900 to-indigo-700 tracking-tighter">
              UniStay
            </span>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none">
              Premium Living
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-10">
          <button 
            onClick={() => onNavigate('home')}
            className={`font-bold text-sm transition-colors ${currentPage === 'home' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
          >
            Find a Stay
          </button>
          <button 
            onClick={() => onNavigate('hostels')}
            className={`font-bold text-sm transition-colors ${currentPage === 'hostels' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
          >
            Hostels
          </button>
          <button 
            onClick={() => onNavigate('rental-rooms')}
            className={`font-bold text-sm transition-colors ${currentPage === 'rental-rooms' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
          >
            Rooms
          </button>
        </div>

        <div className="flex items-center gap-5">
          <button 
            aria-label="Wishlist"
            onClick={() => onNavigate('profile')}
            className="relative p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('profile')}
                className="flex flex-col items-end group"
              >
                <span className="text-xs font-black text-gray-900 group-hover:text-indigo-600">{user.name}</span>
                <span className="text-[10px] font-bold text-gray-400">View Profile</span>
              </button>
              <div 
                onClick={() => onNavigate('profile')}
                className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden cursor-pointer active:scale-95 transition-transform"
              >
                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
              </div>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full font-black text-sm hover:bg-black transition-all shadow-md active:scale-95"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login / Signup</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
