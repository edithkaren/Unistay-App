
import React from 'react';
import { 
  Building2, Instagram, Twitter, Facebook, Linkedin, Youtube, 
  Mail, Phone, MapPin, ArrowRight, Heart, ShieldCheck 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300 pt-20 pb-10 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Branding & Mission */}
          <div className="space-y-6">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2.5 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl shadow-indigo-500/20">
                <Building2 className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-2xl font-black text-white tracking-tighter">
                  UniStay
                </span>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] leading-none">
                  Premium Living
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              UniStay is India's most trusted platform for student and professional accommodation. We bridge the gap between quality living and affordability with zero brokerage.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
                { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
                { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
                { icon: Linkedin, href: '#', color: 'hover:text-blue-500' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className={`p-2 bg-white/5 rounded-lg transition-all duration-300 ${social.color} hover:bg-white/10 hover:-translate-y-1`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Explore */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6">Explore Stays</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Find a Stay
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hostels')} className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Premium Hostels
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rental-rooms')} className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Private Rooms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bookings')} className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  My Bookings
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Locations */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6">Top Cities</h4>
            <ul className="space-y-4 text-sm font-bold">
              {['Bangalore', 'Mumbai', 'Chennai', 'Pune', 'Hyderabad'].map(city => (
                <li key={city}>
                  <button className="hover:text-indigo-400 transition-colors flex items-center gap-2 group text-gray-400">
                    <MapPin className="w-3 h-3 text-indigo-500/50" />
                    Stays in {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support & Trust */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6">Need Help?</h4>
            <div className="space-y-4">
              <a href="mailto:support@unistay.com" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase">Email Us</p>
                  <p className="text-sm font-bold text-gray-200">support@unistay.com</p>
                </div>
              </a>
              <a href="tel:+918888888888" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase">Call Support</p>
                  <p className="text-sm font-bold text-gray-200">+91 62666-29189</p>
                </div>
              </a>
            </div>
            
            <div className="pt-4 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
              <ShieldCheck className="text-green-500 w-6 h-6" />
              <p className="text-[10px] font-bold leading-tight">100% Secure Payments & Data Privacy</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-gray-500">
            © {currentYear} UniStay Premium Living. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-500">
            <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Cookie Policy</button>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for Indian Students
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
