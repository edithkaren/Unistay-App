
import { Property } from './types';

export const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Kochi', 'Jaipur', 'Kolkata', 'Ahmedabad', 'Gurgaon'];

export const TRENDING_CITIES = [
  { name: 'Bangalore', count: '120+ Properties', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Mumbai', count: '85+ Properties', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chennai', count: '70+ Properties', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80' },
  { name: 'Kochi', count: '45+ Properties', image: 'https://images.unsplash.com/photo-1590509835139-4ff1f0551f55?auto=format&fit=crop&w=400&q=80' },
];

export const AMENITIES = [
  'Wi-Fi', 'AC', 'Food Included', 'Laundry', 'Parking', '24/7 Security', 'Gym', 'Power Backup'
];

export const CANCELLATION_POLICY = {
  title: "Cancellation & Refund Policy",
  points: [
    "Full Refund: If cancelled within 24 hours of booking.",
    "Partial Refund (50%): If cancelled after 24 hours but at least 7 days before the move-in date.",
    "No Refund: If cancelled within 7 days of the move-in date or after checking in.",
    "Security Deposit: Usually equivalent to one month's rent, refundable at the end of the stay minus any damages.",
    "Processing Time: Refunds are processed within 5-7 working days to the original payment method."
  ]
};

const DEFAULT_REVIEWS = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Akash Gupta',
    rating: 5,
    comment: 'Great place, very clean and near the metro station. The food is actually good!',
    date: '2024-12-10',
    images: ['https://images.unsplash.com/photo-1555854811-8aa22646d296?auto=format&fit=crop&w=400&q=80']
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Sneha R.',
    rating: 4,
    comment: 'The management is very responsive. WiFi is fast, which is a big plus for WFH.',
    date: '2025-01-05'
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'c1',
    name: 'OMR Elite Gents PG',
    type: 'PG',
    gender: 'Boys',
    city: 'Chennai',
    locality: 'Old Mahabalipuram Road',
    address: 'Door No. 12, Navalur, Near TCS Gateway, OMR Road, Chennai, Tamil Nadu 603103',
    price: 7500,
    rating: 4.4,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Wi-Fi', 'AC', 'Food Included', 'Laundry'],
    nearbyPlaces: ['TCS Gateway (0.2km)', 'Vivira Mall (1km)', 'Satyabama University (3km)', 'Navalur Bus Stop (0.5km)'],
    roomTypes: [
      { type: 'Single Room', price: 11000, available: 3 },
      { type: 'Double Sharing', price: 7500, available: 8 }
    ],
    description: 'Perfect for IT professionals working in the OMR tech corridor. High-speed internet and delicious South Indian meals.',
    distanceFromCampus: '2.0 km from VIT Chennai',
    coordinates: { lat: 12.8427, lng: 80.2263 },
    contactPerson: { name: 'Karthik Raja', phone: '+91 94444 33333', role: 'Property Owner' },
    reviews: []
  },
  {
    id: 'c2',
    name: 'Marina Ladies Premium Hostel',
    type: 'Hostel',
    gender: 'Girls',
    city: 'Chennai',
    locality: 'Mylapore',
    address: '4th Street, Dr Radhakrishnan Salai, Mylapore, Chennai, Tamil Nadu 600004',
    price: 9000,
    rating: 4.7,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Wi-Fi', '24/7 Security', 'Power Backup', 'Laundry'],
    nearbyPlaces: ['Stella Maris College (1.5km)', 'Marina Beach (2km)', 'Mylapore Temple (1km)', 'Chennai Citi Centre (0.8km)'],
    roomTypes: [
      { type: '3 Sharing', price: 9000, available: 4 },
      { type: '2 Sharing', price: 11500, available: 2 }
    ],
    description: 'Located in the cultural heart of Chennai. Very safe with biometric access and 24/7 security guard.',
    distanceFromCampus: '1.5 km from Stella Maris College',
    coordinates: { lat: 13.0418, lng: 80.2662 },
    contactPerson: { name: 'Mrs. Lakshmi', phone: '+91 91234 12345', role: 'Warden' },
    reviews: []
  },
  {
    id: 'c3',
    name: 'IIT Madras Gateway Stay',
    type: 'PG',
    gender: 'Unisex',
    city: 'Chennai',
    locality: 'Adyar',
    address: 'Adyar Main Road, Near IIT Madras Gate, Chennai, Tamil Nadu 600020',
    price: 13000,
    rating: 4.9,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555854811-8aa22646d296?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Wi-Fi', 'AC', 'Parking', 'Gym'],
    nearbyPlaces: ['IIT Madras (0.3km)', 'Adyar Depot (0.6km)', 'Guindy National Park (2km)', 'Phoenix Marketcity (4km)'],
    roomTypes: [
      { type: 'Single Deluxe', price: 18000, available: 2 },
      { type: 'Twin Sharing', price: 13000, available: 4 }
    ],
    description: 'Elite PG for students and research scholars of IIT Madras. Quiet environment with dedicated study areas.',
    distanceFromCampus: '0.3 km from IIT Madras',
    coordinates: { lat: 13.0067, lng: 80.2462 },
    contactPerson: { name: 'Ravi Teja', phone: '+91 98844 55667', role: 'Manager' },
    reviews: []
  },
  {
    id: 'k1',
    name: 'Cochin Student Hub',
    type: 'Hostel',
    gender: 'Unisex',
    city: 'Kochi',
    locality: 'Kalamassery',
    address: 'HMT Junction, Kalamassery, Kochi, Kerala 682033',
    price: 5500,
    rating: 4.2,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Wi-Fi', 'Food Included', 'Parking', 'Laundry'],
    nearbyPlaces: ['CUSAT Campus (0.4km)', 'Kalamassery Metro (1.5km)', 'Apollo Hospital (2km)', 'Decathlon (1km)'],
    roomTypes: [
      { type: 'Dorm Bed', price: 5500, available: 12 },
      { type: 'Private Room', price: 10000, available: 2 }
    ],
    description: 'Budget-friendly student hub located right near the CUSAT campus. Vibrant community atmosphere.',
    distanceFromCampus: '0.4 km from CUSAT',
    coordinates: { lat: 10.0465, lng: 76.3263 },
    contactPerson: { name: 'Joy Varghese', phone: '+91 90000 80000', role: 'General Manager' },
    reviews: []
  },
  {
    id: 'k2',
    name: 'Edappally Smart Living',
    type: 'PG',
    gender: 'Boys',
    city: 'Kochi',
    locality: 'Edappally',
    address: 'Behind Lulu Mall, Edappally, Kochi, Kerala 682024',
    price: 8000,
    rating: 4.6,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Wi-Fi', 'AC', 'Gym', 'Parking'],
    nearbyPlaces: ['Lulu Mall (0.5km)', 'Edappally Metro (0.3km)', 'Amrita Hospital (4km)', 'Oberon Mall (2km)'],
    roomTypes: [
      { type: 'Single Occupancy', price: 13000, available: 1 },
      { type: 'Double Sharing', price: 8000, available: 4 }
    ],
    description: 'Modern PG just walking distance from Lulu Mall and Kochi Metro. Ideal for professionals.',
    distanceFromCampus: '3.0 km from Model Engineering College',
    coordinates: { lat: 10.0261, lng: 76.3075 },
    contactPerson: { name: 'Manu Nair', phone: '+91 99887 76655', role: 'Managing Director' },
    reviews: []
  },
  {
    id: 'k3',
    name: 'Marine Drive Waterfront Studio',
    type: 'Room',
    gender: 'Unisex',
    city: 'Kochi',
    locality: 'Marine Drive',
    address: 'Block 4, Waterfront Apartments, Marine Drive, Kochi, Kerala 682031',
    price: 16000,
    rating: 4.9,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Wi-Fi', 'AC', 'Parking', 'Gym', '24/7 Security'],
    nearbyPlaces: ['Rainbow Bridge (0.5km)', 'Broadway Market (1km)', 'Maharaja College (2.5km)', 'Subhash Park (2km)'],
    roomTypes: [
      { type: 'Full Studio', price: 16000, available: 1 }
    ],
    description: 'Luxury studio apartment with a stunning view of the backwaters. Perfect for high-end stays.',
    distanceFromCampus: '5.0 km from St. Alberts College',
    coordinates: { lat: 9.9836, lng: 76.2758 },
    contactPerson: { name: 'Sarah George', phone: '+91 97777 55555', role: 'Property Administrator' },
    reviews: []
  },
  {
    id: '1',
    name: 'Green View Premium PG',
    type: 'PG',
    gender: 'Boys',
    city: 'Bangalore',
    locality: 'Koramangala',
    address: '45, 1st Main Rd, near Sony World Signal, Koramangala 4th Block, Bengaluru, Karnataka 560034',
    price: 8500,
    rating: 4.5,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555854811-8aa22646d296?auto=format&fit=crop&w=800&q=80'
    ],
    videoTourUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    amenities: ['Wi-Fi', 'Food Included', 'Laundry', '24/7 Security'],
    nearbyPlaces: ['Sony World Signal (0.2km)', 'Forum Mall (1.5km)', 'Christ University (2km)', 'Koramangala BDA (0.8km)'],
    roomTypes: [
      { type: 'Single sharing', price: 12000, available: 2 },
      { type: 'Double sharing', price: 8500, available: 5 }
    ],
    description: 'Modern PG with a vibrant community. Ideal for working professionals and students looking for a peaceful environment.',
    distanceFromCampus: '1.2 km from Christ University',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    contactPerson: { name: 'Rahul Sharma', phone: '+91 98765 43210', role: 'Property Manager' },
    reviews: DEFAULT_REVIEWS
  }
];
