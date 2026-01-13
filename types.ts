
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface Property {
  id: string;
  name: string;
  type: 'PG' | 'Hostel' | 'Room';
  gender: 'Boys' | 'Girls' | 'Unisex';
  city: string;
  locality: string;
  address: string;
  price: number;
  rating: number;
  verified: boolean;
  images: string[];
  videoTourUrl?: string;
  capacity?: number;
  amenities: string[];
  nearbyPlaces?: string[];
  roomTypes: {
    type: string;
    price: number;
    available: number;
  }[];
  description: string;
  distanceFromCampus?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactPerson: {
    name: string;
    phone: string;
    role: string;
  };
  broker?: {
    name: string;
    phone: string;
    company: string;
  };
  reviews: Review[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export interface FilterState {
  city: string;
  gender: string;
  type: string;
  budget: [number, number];
  amenities: string[];
  capacity?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  roomType: string;
  monthlyRent: number;
  userName: string;
  userPhone: string;
  moveInDate: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  bookingDate: string;
  contactPerson: {
    name: string;
    phone: string;
  };
  cancellationReason?: string;
}

export interface Visit {
  id: string;
  propertyId: string;
  propertyName: string;
  visitDate: string;
  visitTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  userName: string;
  userPhone: string;
  propertyAddress: string;
}
