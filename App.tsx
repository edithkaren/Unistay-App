
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard, { RatingStars } from './components/PropertyCard';
import FilterBar from './components/FilterBar';
import ChatAssistant from './components/ChatAssistant';
import Footer from './components/Footer';
import { MOCK_PROPERTIES, TRENDING_CITIES, CITIES, CANCELLATION_POLICY } from './constants';
import { FilterState, Property, Booking, User, Review, Visit } from './types';
import { 
  Search, MapPin, Sparkles, Building2, X, Shield, Coffee, Wifi, Star, ArrowRight, Zap, 
  Home, CheckCircle2, Calendar, Phone, User as UserIcon, Info, Loader2, AlertTriangle, 
  FileText, ExternalLink, Navigation, Compass, Mail, Lock, MessageSquare, Heart, 
  ClipboardCheck, PlayCircle, Users, BadgeCheck, Trash2, Camera, StarHalf, LogOut, 
  Map as MapIcon, Maximize2, ChevronLeft, ChevronRight, LocateFixed, Share2, ClipboardList,
  MessageCircle, Copy, Check, Clock, Undo2, CalendarCheck, ImagePlus
} from 'lucide-react';

type AppSection = 'home' | 'hostels' | 'bookings' | 'contact' | 'terms' | 'privacy' | 'cities' | 'rental-rooms' | 'profile';
type BookingStep = 'details' | 'selection' | 'form' | 'checklist' | 'success';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAJ6wMXUnClYAmY3Y1gzCfqKiQe598pMRg';

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppSection>('home');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('Recommended');
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    gender: 'All',
    type: 'All',
    budget: [0, 50000],
    amenities: [],
    capacity: undefined
  });

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Geolocation State
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authFormData, setAuthFormData] = useState({ name: '', email: '', password: '' });

  // Booking Flow States
  const [bookingStep, setBookingStep] = useState<BookingStep>('details');
  const [selectedRoomType, setSelectedRoomType] = useState<Property['roomTypes'][0] | null>(null);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', date: '' });
  const [checklistItems, setChecklistItems] = useState({ 
    idProof: false, 
    rulesRead: false, 
    depositAck: false,
    physicalVisit: false 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Visit Flow States
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitFormData, setVisitFormData] = useState({ date: '', timeSlot: '' });

  // Cancellation State
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancellingVisit, setCancellingVisit] = useState<Visit | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const propId = params.get('propId');
    if (propId) {
      const property = MOCK_PROPERTIES.find(p => p.id === propId);
      if (property) handleOpenProperty(property);
    }

    const savedWishlist = localStorage.getItem('unistay_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    const savedRecently = localStorage.getItem('unistay_recently');
    if (savedRecently) setRecentlyViewed(JSON.parse(savedRecently));
    const savedBookings = localStorage.getItem('unistay_bookings');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    const savedVisits = localStorage.getItem('unistay_visits');
    if (savedVisits) setVisits(JSON.parse(savedVisits));
    const savedUser = localStorage.getItem('unistay_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    handleGetLocation();
  }, []);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsLocating(false);
        },
        () => setIsLocating(false)
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDistanceString = (propCoords: { lat: number, lng: number }) => {
    if (!userCoords) return undefined;
    const dist = calculateDistance(userCoords.lat, userCoords.lng, propCoords.lat, propCoords.lng);
    return dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(1)}km`;
  };

  useEffect(() => localStorage.setItem('unistay_wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('unistay_recently', JSON.stringify(recentlyViewed)), [recentlyViewed]);
  useEffect(() => localStorage.setItem('unistay_bookings', JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem('unistay_visits', JSON.stringify(visits)), [visits]);
  useEffect(() => {
    if (user) localStorage.setItem('unistay_user', JSON.stringify(user));
    else localStorage.removeItem('unistay_user');
  }, [user]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleOpenProperty = (p: Property) => {
    setSelectedProperty(p);
    setActiveImageIdx(0);
    setBookingStep('details');
    setSelectedRoomType(null);
    setChecklistItems({ idProof: false, rulesRead: false, depositAck: false, physicalVisit: false });
    setRecentlyViewed(prev => [p.id, ...prev.filter(id => id !== p.id)].slice(0, 8));
  };

  const handleStartBooking = () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    setBookingStep('selection');
  };

  const handleOpenVisitModal = () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    setIsVisitModalOpen(true);
  };

  const handleSelectRoom = (room: Property['roomTypes'][0]) => {
    if (room.available > 0) {
      setSelectedRoomType(room);
      setBookingStep('form');
      if (user) setBookingForm(prev => ({ ...prev, name: user.name }));
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newUser: User = { 
        id: 'u-' + Math.random().toString(36).substr(2, 5), 
        name: authFormData.name || authFormData.email.split('@')[0], 
        email: authFormData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authFormData.name || authFormData.email}`
      };
      setUser(newUser);
      setIsSubmitting(false);
      setIsAuthModalOpen(false);
    }, 1000);
  };

  const handleLogout = () => { setUser(null); setCurrentPage('home'); };

  const submitBooking = () => {
    if (!selectedProperty || !selectedRoomType || !bookingForm.name || !bookingForm.phone || !bookingForm.date) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const newBooking: Booking = {
        id: `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        roomType: selectedRoomType.type,
        monthlyRent: selectedRoomType.price,
        userName: bookingForm.name,
        userPhone: bookingForm.phone,
        moveInDate: bookingForm.date,
        status: 'Confirmed',
        bookingDate: new Date().toISOString(),
        contactPerson: { name: selectedProperty.contactPerson.name, phone: selectedProperty.contactPerson.phone }
      };
      setBookings(prev => [newBooking, ...prev]);
      setIsSubmitting(false);
      setBookingStep('success');
    }, 1500);
  };

  const submitVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !visitFormData.date || !visitFormData.timeSlot || !user) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const newVisit: Visit = {
        id: `VS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        visitDate: visitFormData.date,
        visitTime: visitFormData.timeSlot,
        status: 'Scheduled',
        userName: user.name,
        userPhone: user.phone || '9999999999',
        propertyAddress: selectedProperty.address
      };
      setVisits(prev => [newVisit, ...prev]);
      setIsSubmitting(false);
      setIsVisitModalOpen(false);
      setVisitFormData({ date: '', timeSlot: '' });
      setSelectedProperty(null);
      setCurrentPage('bookings');
    }, 1200);
  };

  const handleCancelBooking = () => {
    if (!cancellingBooking) return;
    setBookings(prev => prev.map(b => 
      b.id === cancellingBooking.id 
        ? { ...b, status: 'Cancelled' as const, cancellationReason } 
        : b
    ));
    setCancellingBooking(null);
    setCancellationReason('');
  };

  const handleCancelVisit = (v: Visit) => {
    setVisits(prev => prev.map(visit => 
      visit.id === v.id ? { ...visit, status: 'Cancelled' } : visit
    ));
    setCancellingVisit(null);
  };

  const handleNavigate = (page: AppSection) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if ((page === 'profile' || page === 'bookings') && !user) {
      setIsAuthModalOpen(true);
      setCurrentPage('home');
    }
  };

  const getMapEmbedUrl = (prop: Property) => {
    const q = encodeURIComponent(`${prop.address}`);
    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${q}&center=${prop.coordinates.lat},${prop.coordinates.lng}&zoom=16`;
  };

  const handleShareWhatsApp = () => {
    if (!selectedProperty) return;
    const baseUrl = window.location.origin + window.location.pathname;
    const url = `${baseUrl}?propId=${selectedProperty.id}`;
    const text = encodeURIComponent(
      `Hi! Check out this stay at UniStay:\n\n🏡 *${selectedProperty.name}*\n📍 ${selectedProperty.locality}, ${selectedProperty.city}\n💰 Rent: ₹${selectedProperty.price}/mo\n\nView details here: ${url}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    if (!selectedProperty) return;
    const baseUrl = window.location.origin + window.location.pathname;
    const url = `${baseUrl}?propId=${selectedProperty.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShareMenu(false);
    }, 1500);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUser({ ...user, avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter(p => {
      const cityMatch = !filters.city || p.city.toLowerCase() === filters.city.toLowerCase();
      const genderMatch = filters.gender === 'All' || p.gender === filters.gender;
      const typeMatch = filters.type === 'All' || p.type === filters.type;
      const budgetMatch = p.price >= filters.budget[0] && p.price <= filters.budget[1];
      const capacityMatch = !filters.capacity || p.capacity === filters.capacity;
      return cityMatch && genderMatch && typeMatch && budgetMatch && capacityMatch;
    });
  }, [filters]);

  const renderMapView = () => (
    <div className="w-full h-[calc(100vh-200px)] rounded-[3rem] overflow-hidden border border-gray-100 shadow-inner bg-gray-100 relative">
      <iframe
        width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${userCoords?.lat || 12.9716},${userCoords?.lng || 77.5946}&zoom=12`}
        allowFullScreen loading="lazy"
      ></iframe>
      {filteredProperties.map((p, idx) => (
        <div key={p.id} onClick={() => handleOpenProperty(p)} className="absolute cursor-pointer hover:z-50 group"
          style={{ top: `${30 + (idx * 15) % 40}%`, left: `${30 + (idx * 12) % 40}%` }}>
          <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-xl border-2 border-white group-hover:bg-black transition-all">
            ₹{p.price}
          </div>
          <div className="w-0.5 h-3 bg-indigo-600 mx-auto group-hover:bg-black"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar wishlistCount={wishlist.length} currentPage={currentPage} onNavigate={handleNavigate} user={user} onLoginClick={() => setIsAuthModalOpen(true)} onLogout={handleLogout} />
      
      {currentPage === 'profile' || currentPage === 'bookings' ? (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
          {currentPage === 'profile' ? (
            <div className="space-y-10">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center md:flex-row md:items-start gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden relative">
                    <img src={user?.avatar} alt="avatar" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="text-white w-8 h-8" />
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-indigo-700 transition-colors"
                  >
                    <ImagePlus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-center md:text-left flex-1">
                   <h2 className="text-3xl font-black mb-1">{user?.name}</h2>
                   <p className="text-gray-500 font-bold mb-6">{user?.email}</p>
                   <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <button onClick={() => handleNavigate('bookings')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">My Stays & Visits</button>
                      <button onClick={handleLogout} className="bg-red-50 text-red-600 px-8 py-3 rounded-2xl font-black text-sm hover:bg-red-100 transition-all">Sign Out</button>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-[3rem] border border-gray-100">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Heart className="w-5 h-5 text-red-500" /> Your Wishlist</h3>
                    {wishlist.length === 0 ? <p className="text-gray-400 font-bold text-center py-10">Your wishlist is empty.</p> : 
                      <div className="space-y-4">
                         {MOCK_PROPERTIES.filter(p => wishlist.includes(p.id)).map(p => (
                           <div key={p.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => handleOpenProperty(p)}>
                              <div className="w-16 h-16 rounded-2xl overflow-hidden">
                                <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1">
                                 <p className="font-black text-gray-900 leading-tight">{p.name}</p>
                                 <p className="text-xs text-gray-400 font-bold">{p.locality}</p>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }} className="p-2 text-gray-300 hover:text-red-500"><X className="w-5 h-5" /></button>
                           </div>
                         ))}
                      </div>
                    }
                 </div>
                 <div className="bg-white p-8 rounded-[3rem] border border-gray-100">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /> Activity</h3>
                    <div className="space-y-4">
                       <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                          <div><p className="font-black text-gray-900 leading-none mb-1">Bookings</p><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{bookings.length} Total</p></div>
                          <button onClick={() => handleNavigate('bookings')} className="p-2 bg-white rounded-xl text-gray-400 hover:text-indigo-600"><ArrowRight className="w-4 h-4" /></button>
                       </div>
                       <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                          <div><p className="font-black text-gray-900 leading-none mb-1">Property Visits</p><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{visits.length} Scheduled</p></div>
                          <button onClick={() => handleNavigate('bookings')} className="p-2 bg-white rounded-xl text-gray-400 hover:text-indigo-600"><ArrowRight className="w-4 h-4" /></button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
               <div className="flex items-center gap-4"><button onClick={() => handleNavigate('profile')} className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200"><ChevronLeft className="w-6 h-6" /></button><h2 className="text-4xl font-black tracking-tighter">My Bookings</h2></div>
               <div className="grid grid-cols-1 gap-12">
                  <section>
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-3"><Home className="w-4 h-4" /> Property Stays</h4>
                    {bookings.length === 0 ? <p className="text-gray-400 font-bold italic py-10 text-center bg-gray-50/50 rounded-3xl border border-dashed">No active stay reservations.</p> : 
                      <div className="grid grid-cols-1 gap-6">
                        {bookings.map(booking => (
                          <div key={booking.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row items-center gap-8 group">
                            <div className="w-full md:w-48 h-48 bg-gray-100 rounded-[2rem] overflow-hidden"><img src={MOCK_PROPERTIES.find(p => p.id === booking.propertyId)?.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                            <div className="flex-1 space-y-4">
                               <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-600' : booking.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>{booking.status}</span><h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{booking.propertyName}</h3><p className="text-sm font-bold text-gray-400 mt-2">{booking.roomType} • Move-in: {new Date(booking.moveInDate).toLocaleDateString()}</p></div>
                                  <div className="text-right"><p className="text-2xl font-black text-indigo-600 leading-none">₹{booking.monthlyRent}</p><p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-1">Monthly Rent</p></div>
                               </div>
                               <div className="flex flex-wrap gap-4 pt-4">
                                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100"><div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-black text-indigo-600 text-xs">{booking.contactPerson.name[0]}</div><div><p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-0.5">Manager</p><p className="text-xs font-black text-gray-900">{booking.contactPerson.name}</p></div></div>
                                  {booking.status !== 'Cancelled' && <button onClick={() => setCancellingBooking(booking)} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-2xl transition-colors ml-auto font-black text-xs"><Undo2 className="w-4 h-4" /> Cancel Stay</button>}
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    }
                  </section>

                  <section>
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-3"><CalendarCheck className="w-4 h-4" /> Property Visits</h4>
                    {visits.length === 0 ? <p className="text-gray-400 font-bold italic py-10 text-center bg-gray-50/50 rounded-3xl border border-dashed">No scheduled property visits.</p> : 
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {visits.map(visit => (
                          <div key={visit.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative group overflow-hidden">
                             <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest ${visit.status === 'Scheduled' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{visit.status}</div>
                             <div className="space-y-4">
                                <div><h4 className="text-xl font-black text-gray-900 pr-20">{visit.propertyName}</h4><p className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {visit.propertyAddress}</p></div>
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                   <div className="flex-1"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Date</p><p className="text-sm font-black text-gray-900">{new Date(visit.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p></div>
                                   <div className="w-px h-6 bg-gray-200"></div>
                                   <div className="flex-1"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Time</p><p className="text-sm font-black text-gray-900">{visit.visitTime}</p></div>
                                </div>
                                {visit.status === 'Scheduled' && (
                                   <button onClick={() => handleCancelVisit(visit)} className="w-full py-3 rounded-xl border border-red-100 text-red-500 font-black text-xs hover:bg-red-50 transition-colors">Cancel Visit</button>
                                )}
                             </div>
                          </div>
                        ))}
                      </div>
                    }
                  </section>
               </div>
            </div>
          )}
        </main>
      ) : (
        <>
          {currentPage === 'home' && <Hero onSearch={(c) => { setFilters(f => ({...f, city: c})); setCurrentPage('home'); }} />}
          {(currentPage === 'rental-rooms' || currentPage === 'hostels' || (currentPage === 'home' && filters.city)) && <FilterBar filters={filters} setFilters={setFilters} viewMode={viewMode} setViewMode={setViewMode} sortBy={sortBy} setSortBy={setSortBy} />}
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProperties.length === 0 ? <p className="col-span-3 text-center py-20 text-gray-400 font-bold">No properties found matching your filters.</p> : 
                  filteredProperties.map(p => <PropertyCard key={p.id} property={p} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={toggleWishlist} onView={handleOpenProperty} userDistance={getDistanceString(p.coordinates)} />)
                }
              </div>
            ) : renderMapView()}
          </main>
        </>
      )}

      {/* Visit Modal */}
      {isVisitModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md">
           <div className="bg-white rounded-[3.5rem] max-w-lg w-full p-10 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                <div><p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Schedule a visit</p><h3 className="text-3xl font-black tracking-tighter text-gray-900">Choose your slot</h3></div>
                <button onClick={() => setIsVisitModalOpen(false)} className="p-3 bg-gray-50 rounded-2xl"><X className="w-6 h-6 text-gray-400" /></button>
              </div>
              <form onSubmit={submitVisit} className="space-y-8">
                 <div className="space-y-3">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Date</p>
                   <input required type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-600 font-bold text-gray-900" value={visitFormData.date} onChange={(e) => setVisitFormData(p => ({...p, date: e.target.value}))} />
                 </div>
                 <div className="space-y-3">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Time</p>
                   <div className="grid grid-cols-2 gap-3">
                      {TIME_SLOTS.map(slot => (
                        <button key={slot} type="button" onClick={() => setVisitFormData(p => ({...p, timeSlot: slot}))} className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${visitFormData.timeSlot === slot ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-700 hover:border-indigo-100'}`}>
                           {slot}
                        </button>
                      ))}
                   </div>
                 </div>
                 <button type="submit" disabled={isSubmitting || !visitFormData.date || !visitFormData.timeSlot} className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
                   {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Schedule Visit <CalendarCheck className="w-6 h-6" /></>}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md">
           <div className="bg-white rounded-[3rem] max-w-md w-full p-10 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6"><h3 className="text-3xl font-black tracking-tighter text-red-600">Cancel Booking?</h3><button onClick={() => setCancellingBooking(null)}><X className="w-8 h-8 text-gray-300" /></button></div>
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4 mb-8"><AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" /><p className="text-xs font-bold text-amber-800 leading-relaxed">{CANCELLATION_POLICY.points[0]} Check policy before confirming.</p></div>
              <div className="space-y-4">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Reason for cancelling?</p>
                 <select value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-red-500 font-bold text-gray-900 outline-none"><option value="">Select a reason</option><option value="Change of plans">Change of plans</option><option value="Found better accommodation">Better accommodation</option><option value="Personal reasons">Personal reasons</option></select>
                 <div className="flex gap-4 pt-4"><button onClick={() => setCancellingBooking(null)} className="flex-1 py-4 rounded-3xl font-black text-gray-500 hover:bg-gray-100 transition-all">Go Back</button><button onClick={handleCancelBooking} disabled={!cancellationReason} className="flex-2 bg-red-600 text-white px-10 py-4 rounded-3xl font-black shadow-xl hover:bg-red-700 disabled:opacity-30 transition-all">Cancel Stay</button></div>
              </div>
           </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md">
           <div className="bg-white rounded-[3rem] max-w-md w-full p-10 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8"><h3 className="text-3xl font-black tracking-tighter">Welcome!</h3><button onClick={() => setIsAuthModalOpen(false)}><X className="w-8 h-8 text-gray-300" /></button></div>
              <form onSubmit={handleAuthSubmit} className="space-y-4"><input required type="text" placeholder="Full Name" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-600 font-bold text-gray-900" value={authFormData.name} onChange={(e) => setAuthFormData(p => ({...p, name: e.target.value}))} /><input required type="email" placeholder="Email" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-600 font-bold text-gray-900" value={authFormData.email} onChange={(e) => setAuthFormData(p => ({...p, email: e.target.value}))} /><input required type="password" placeholder="Password" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-600 font-bold text-gray-900" value={authFormData.password} onChange={(e) => setAuthFormData(p => ({...p, password: e.target.value}))} /><button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">Join UniStay</button></form>
           </div>
        </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-gray-900/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[3rem] max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-white">
              <div><h2 className="text-3xl font-black text-gray-900 leading-none mb-2">{selectedProperty.name}</h2><div className="flex items-center gap-4"><p className="text-indigo-600 font-bold flex items-center gap-2 text-sm"><MapPin className="w-4 h-4" />{selectedProperty.locality}, {selectedProperty.city}</p></div></div>
              <div className="flex items-center gap-3 relative"><div className="relative"><button onClick={() => setShowShareMenu(!showShareMenu)} className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors flex items-center gap-2 font-bold text-sm"><Share2 className="w-5 h-5" /><span className="hidden sm:inline">Share</span></button>{showShareMenu && <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-indigo-100 rounded-3xl shadow-2xl p-4 z-[110] animate-in slide-in-from-top-2"><div className="space-y-2"><button onClick={handleShareWhatsApp} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-green-50 text-gray-700 transition-colors"><div className="bg-[#25D366] text-white p-2 rounded-xl"><MessageCircle className="w-4 h-4" /></div><span className="text-sm font-black">WhatsApp</span></button><button onClick={handleCopyLink} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-indigo-50 text-gray-700 transition-colors"><div className={`${copied ? 'bg-green-600' : 'bg-indigo-600'} text-white p-2 rounded-xl transition-colors`}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</div><span className="text-sm font-black">{copied ? 'Copied!' : 'Copy Link'}</span></button></div></div>}</div><button onClick={() => setSelectedProperty(null)} className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"><X className="w-8 h-8 text-gray-400" /></button></div>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              <div className="md:w-3/5 bg-gray-100 overflow-y-auto custom-scrollbar p-8">
                {bookingStep === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-90 duration-500 bg-white rounded-[3rem] p-12 border border-green-100 shadow-xl"><div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center shadow-inner"><CheckCircle2 className="w-12 h-12 text-green-600" /></div><div><h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Stay Confirmed!</h3><p className="text-gray-500 font-bold max-w-md">You've successfully reserved your spot at {selectedProperty.name}.</p></div><button onClick={() => handleNavigate('bookings')} className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-black transition-all">View All Bookings</button></div>
                ) : (
                  <div className="space-y-10">
                    <div className="relative group bg-white p-2 rounded-[2.5rem] shadow-sm border border-gray-100"><div className="aspect-[16/9] w-full rounded-[2rem] overflow-hidden relative shadow-2xl"><img src={selectedProperty.images[activeImageIdx]} className="w-full h-full object-cover transition-opacity duration-500" alt="view" /><button onClick={(e) => { e.stopPropagation(); setActiveImageIdx(prev => (prev - 1 + selectedProperty.images.length) % selectedProperty.images.length); }} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white backdrop-blur-md p-3 rounded-full text-indigo-900 shadow-xl opacity-0 group-hover:opacity-100"><ChevronLeft className="w-6 h-6" /></button><button onClick={(e) => { e.stopPropagation(); setActiveImageIdx(prev => (prev + 1) % selectedProperty.images.length); }} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white backdrop-blur-md p-3 rounded-full text-indigo-900 shadow-xl opacity-0 group-hover:opacity-100"><ChevronRight className="w-6 h-6" /></button></div></div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"><h3 className="text-2xl font-black mb-4">About this stay</h3><p className="text-gray-600 leading-relaxed mb-8">{selectedProperty.description}</p>
                      {selectedProperty.nearbyPlaces && selectedProperty.nearbyPlaces.length > 0 && <div className="mb-8"><h4 className="text-lg font-black mb-4 flex items-center gap-2"><Navigation className="w-5 h-5 text-indigo-600" /> Location Highlights</h4><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{selectedProperty.nearbyPlaces.map((place, idx) => (<div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100"><MapPin className="w-4 h-4 text-indigo-400 shrink-0" /><span className="text-xs font-bold text-gray-700">{place}</span></div>))}</div></div>}
                      <h4 className="text-lg font-black mb-4">Amenities</h4><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{selectedProperty.amenities.map(a => (<div key={a} className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100"><Zap className="w-6 h-6 text-indigo-600 mb-2" /><span className="text-xs font-bold text-gray-700">{a}</span></div>))}</div>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100"><div className="flex items-center justify-between mb-4"><h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2"><MapIcon className="w-5 h-5" /> Location Map</h4><a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedProperty.coordinates.lat},${selectedProperty.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-gray-400 hover:text-indigo-600 uppercase flex items-center gap-1">Directions <ExternalLink className="w-3 h-3" /></a></div><div className="w-full h-80 rounded-[1.5rem] overflow-hidden bg-gray-100"><iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={getMapEmbedUrl(selectedProperty)} allowFullScreen loading="lazy"></iframe></div></div>
                  </div>
                )}
              </div>

              {bookingStep !== 'success' && (
                <div className="md:w-2/5 p-8 overflow-y-auto custom-scrollbar flex flex-col space-y-8 bg-white border-l border-gray-100">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">{bookingStep !== 'details' && <button onClick={() => setBookingStep('details')} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><ArrowRight className="w-5 h-5 rotate-180" /></button>}<h4 className="text-2xl font-black text-gray-900 tracking-tighter">Reservation</h4></div>
                      {bookingStep === 'details' && (
                        <div className="space-y-6">
                           <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200"><p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Starting from</p><div className="flex items-baseline gap-1"><span className="text-4xl font-black">₹{selectedProperty.price}</span><span className="text-xs font-bold opacity-60">/month</span></div>
                              <div className="flex flex-col gap-3 mt-8">
                                <button onClick={handleStartBooking} className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">Book Now</button>
                                <button onClick={handleOpenVisitModal} className="w-full bg-indigo-500/30 backdrop-blur-md text-white border border-white/20 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-500/50 transition-all">
                                   <CalendarCheck className="w-4 h-4" />
                                   Schedule Free Visit
                                </button>
                              </div>
                           </div>
                           <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100"><h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Quick Contact</h5><div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-black text-white shadow-lg">{selectedProperty.contactPerson.name[0]}</div><div><p className="font-black text-gray-900 leading-none">{selectedProperty.contactPerson.name}</p><p className="text-xs text-gray-400 font-bold mt-1">{selectedProperty.contactPerson.role}</p></div></div><a href={`tel:${selectedProperty.contactPerson.phone}`} className="w-full bg-white border border-indigo-100 text-indigo-600 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-sm"><Phone className="w-4 h-4" />{selectedProperty.contactPerson.phone}</a></div>
                        </div>
                      )}
                      {bookingStep === 'selection' && <div className="space-y-4">{selectedProperty.roomTypes.map(rt => (<button key={rt.type} disabled={rt.available === 0} onClick={() => handleSelectRoom(rt)} className={`w-full text-left p-6 rounded-3xl border-2 transition-all group ${rt.available > 0 ? 'border-gray-50 hover:border-indigo-600 hover:bg-indigo-50/10' : 'opacity-50 grayscale cursor-not-allowed'}`}><div className="flex justify-between items-center mb-1"><p className="font-black text-gray-900 text-lg">{rt.type}</p><p className="font-black text-indigo-600 text-xl">₹{rt.price}</p></div><p className={`text-[10px] font-black uppercase tracking-widest ${rt.available < 3 ? 'text-red-500' : 'text-green-600'}`}>{rt.available} beds left</p></button>))}</div>}
                      {bookingStep === 'form' && <form onSubmit={(e) => {e.preventDefault(); setBookingStep('checklist');}} className="space-y-4"><input required type="text" placeholder="Full Name" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-600 font-bold" value={bookingForm.name} onChange={(e) => setBookingForm(p => ({...p, name: e.target.value}))} /><input required type="tel" placeholder="Contact Number" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-600 font-bold" value={bookingForm.phone} onChange={(e) => setBookingForm(p => ({...p, phone: e.target.value}))} /><div className="relative"><input required type="date" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-600 font-bold" value={bookingForm.date} onChange={(e) => setBookingForm(p => ({...p, date: e.target.value}))} /><span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 pointer-events-none uppercase">Move-in</span></div><button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black shadow-xl hover:bg-indigo-700 transition-all">Continue to Verification</button></form>}
                      {bookingStep === 'checklist' && <div className="space-y-6"><div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 flex gap-4"><AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" /><p className="text-xs font-bold text-yellow-800 leading-relaxed">Complete this pre-booking checklist to proceed.</p></div><div className="space-y-3">{[{ id: 'idProof', icon: UserIcon, label: "Identity Verification", desc: "I have a valid Photo ID." }, { id: 'rulesRead', icon: Shield, label: "House Rules Awareness", desc: "I understand property policies." }, { id: 'depositAck', icon: Zap, label: "Deposit Acknowledgement", desc: "Security deposit is mandatory." }, { id: 'physicalVisit', icon: MapIcon, label: "Physical Visit Commitment", desc: "Subject to a physical visit." }].map(item => (<label key={item.id} className={`flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2 ${(checklistItems as any)[item.id] ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-100 hover:border-indigo-100'}`}><div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${(checklistItems as any)[item.id] ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'}`}><input type="checkbox" className="hidden" checked={(checklistItems as any)[item.id]} onChange={(e) => setChecklistItems(p => ({...p, [item.id]: e.target.checked}))} />{(checklistItems as any)[item.id] && <CheckCircle2 className="w-4 h-4" />}</div><div><p className="text-sm font-black text-gray-900 leading-none mb-1 flex items-center gap-2"><item.icon className="w-3.5 h-3.5 text-indigo-500" />{item.label}</p><p className="text-[11px] text-gray-500 font-medium leading-tight">{item.desc}</p></div></label>))}</div><button onClick={submitBooking} disabled={isSubmitting || !Object.values(checklistItems).every(Boolean)} className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-black active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-3">{isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Finalize Reservation'}</button></div>}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer onNavigate={handleNavigate} />
      <ChatAssistant />
    </div>
  );
};

export default App;
