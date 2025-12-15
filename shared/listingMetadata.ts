// Category-specific metadata types for listings

export interface RestaurantMetadata {
  cuisineType?: string[];
  priceRange?: 'budget' | 'mid-range' | 'premium' | 'fine-dining';
  seatingCapacity?: number;
  reservationRequired?: boolean;
  dietaryOptions?: string[];
  hoursOfOperation?: string;
  parking?: boolean;
  outdoorSeating?: boolean;
  alcoholServed?: boolean;
  liveMusic?: boolean;
  paymentMethods?: string[];
}

export interface AccommodationMetadata {
  roomTypes?: string[];
  totalRooms?: number;
  amenities?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  starRating?: number;
  breakfastIncluded?: boolean;
  wifi?: boolean;
  pool?: boolean;
  airConditioning?: boolean;
  petFriendly?: boolean;
  wheelchairAccessible?: boolean;
  parking?: boolean;
}

export interface TourOperatorMetadata {
  tourTypes?: string[];
  destinations?: string[];
  groupSizeMin?: number;
  groupSizeMax?: number;
  durationMin?: string;
  durationMax?: string;
  languages?: string[];
  includesTransport?: boolean;
  includesMeals?: boolean;
  includesAccommodation?: boolean;
  vehicleTypes?: string[];
}

export interface CampsiteMetadata {
  pitchTypes?: string[];
  totalPitches?: number;
  facilities?: string[];
  powerAvailable?: boolean;
  waterAvailable?: boolean;
  ablutionBlocks?: number;
  firesAllowed?: boolean;
  petFriendly?: boolean;
  securityFenced?: boolean;
  swimmingPool?: boolean;
}

export interface ShuttleMetadata {
  routes?: string[];
  vehicleTypes?: string[];
  seatingCapacity?: number;
  airConditioned?: boolean;
  luggageCapacity?: string;
  operatingHours?: string;
  bookingRequired?: boolean;
  airportTransfers?: boolean;
}

export interface ShopMetadata {
  productCategories?: string[];
  authenticityVerification?: 'artisan-verified' | 'semi-artisan' | 'retail-mix' | 'mass-market';
  featuredArtists?: string;
  onlineSales?: boolean;
  shippingOptions?: string[];
  paymentMethods?: string[];
  parking?: boolean;
  wheelchairAccessible?: boolean;
}

export interface ActivityMetadata {
  activityType?: string;
  difficultyLevel?: 'easy' | 'moderate' | 'challenging' | 'extreme';
  duration?: string;
  minAge?: number;
  maxParticipants?: number;
  equipmentProvided?: boolean;
  fitnessRequired?: string;
  seasonalAvailability?: string[];
}

export type ListingMetadata = 
  | RestaurantMetadata 
  | AccommodationMetadata 
  | TourOperatorMetadata 
  | CampsiteMetadata 
  | ShuttleMetadata 
  | ShopMetadata 
  | ActivityMetadata;

// Category slug to metadata type mapping
export const categoryMetadataTypes: Record<string, string> = {
  'restaurants-dining': 'restaurant',
  'hotels': 'accommodation',
  'lodges': 'accommodation',
  'guest-houses': 'accommodation',
  'bed-breakfasts': 'accommodation',
  'self-catering': 'accommodation',
  'resorts': 'accommodation',
  'campsites-caravan-parks': 'campsite',
  'tented-camps': 'campsite',
  'tour-operators': 'tour-operator',
  'safari-operators': 'tour-operator',
  'tour-guides': 'tour-operator',
  'shuttles-transport': 'shuttle',
  'vehicle-rentals': 'shuttle',
  'air-charters': 'shuttle',
  'souvenir-gift-shops': 'shop',
  'art-galleries': 'shop',
  'activity-operators': 'activity',
  'adventure-sports': 'activity',
};

// Helper function to get metadata type for a category
export function getMetadataType(categorySlug: string): string {
  return categoryMetadataTypes[categorySlug] || 'general';
}

// Metadata field definitions for form rendering
export const metadataFieldDefinitions: Record<string, { label: string; type: string; options?: string[] }[]> = {
  restaurant: [
    { label: 'Cuisine Type', type: 'multiselect', options: ['Namibian', 'European', 'Asian', 'African Fusion', 'Seafood', 'Vegetarian', 'Vegan', 'International'] },
    { label: 'Price Range', type: 'select', options: ['budget', 'mid-range', 'premium', 'fine-dining'] },
    { label: 'Seating Capacity', type: 'number' },
    { label: 'Reservation Required', type: 'boolean' },
    { label: 'Hours of Operation', type: 'text' },
    { label: 'Outdoor Seating', type: 'boolean' },
    { label: 'Alcohol Served', type: 'boolean' },
    { label: 'Parking Available', type: 'boolean' },
  ],
  accommodation: [
    { label: 'Room Types', type: 'multiselect', options: ['Single', 'Double', 'Twin', 'Family', 'Suite', 'Chalet', 'Bungalow'] },
    { label: 'Total Rooms', type: 'number' },
    { label: 'Star Rating', type: 'select', options: ['1', '2', '3', '4', '5'] },
    { label: 'Check-in Time', type: 'text' },
    { label: 'Check-out Time', type: 'text' },
    { label: 'Breakfast Included', type: 'boolean' },
    { label: 'WiFi', type: 'boolean' },
    { label: 'Swimming Pool', type: 'boolean' },
    { label: 'Air Conditioning', type: 'boolean' },
    { label: 'Pet Friendly', type: 'boolean' },
  ],
  'tour-operator': [
    { label: 'Tour Types', type: 'multiselect', options: ['Safari', 'Desert', 'Cultural', 'Adventure', 'Photography', 'Birding', 'Fishing', 'Hunting'] },
    { label: 'Destinations', type: 'multiselect', options: ['Etosha', 'Sossusvlei', 'Fish River Canyon', 'Skeleton Coast', 'Damaraland', 'Caprivi', 'Kaokoland'] },
    { label: 'Min Group Size', type: 'number' },
    { label: 'Max Group Size', type: 'number' },
    { label: 'Languages', type: 'multiselect', options: ['English', 'German', 'French', 'Afrikaans', 'Portuguese', 'Spanish'] },
    { label: 'Includes Transport', type: 'boolean' },
    { label: 'Includes Meals', type: 'boolean' },
    { label: 'Includes Accommodation', type: 'boolean' },
  ],
  campsite: [
    { label: 'Pitch Types', type: 'multiselect', options: ['Tent', 'Caravan', 'Camper', 'Rooftop Tent'] },
    { label: 'Total Pitches', type: 'number' },
    { label: 'Power Available', type: 'boolean' },
    { label: 'Water Available', type: 'boolean' },
    { label: 'Ablution Blocks', type: 'number' },
    { label: 'Fires Allowed', type: 'boolean' },
    { label: 'Pet Friendly', type: 'boolean' },
    { label: 'Security Fenced', type: 'boolean' },
    { label: 'Swimming Pool', type: 'boolean' },
  ],
  shuttle: [
    { label: 'Routes', type: 'multiselect', options: ['Windhoek-Swakopmund', 'Windhoek-Etosha', 'Windhoek-Sossusvlei', 'Airport Transfers', 'City Tours'] },
    { label: 'Vehicle Types', type: 'multiselect', options: ['Sedan', 'SUV', '4x4', 'Minibus', 'Coach'] },
    { label: 'Seating Capacity', type: 'number' },
    { label: 'Air Conditioned', type: 'boolean' },
    { label: 'Operating Hours', type: 'text' },
    { label: 'Booking Required', type: 'boolean' },
    { label: 'Airport Transfers', type: 'boolean' },
  ],
  shop: [
    { label: 'Product Categories', type: 'multiselect', options: ['Crafts', 'Art', 'Jewelry', 'Textiles', 'Clothing', 'Books', 'Food', 'Home Decor'] },
    { label: 'Authenticity', type: 'select', options: ['artisan-verified', 'semi-artisan', 'retail-mix', 'mass-market'] },
    { label: 'Featured Artists', type: 'text' },
    { label: 'Online Sales', type: 'boolean' },
    { label: 'Shipping Options', type: 'multiselect', options: ['Local Delivery', 'Nationwide', 'International', 'Pickup Only'] },
    { label: 'Parking Available', type: 'boolean' },
  ],
  activity: [
    { label: 'Activity Type', type: 'text' },
    { label: 'Difficulty Level', type: 'select', options: ['easy', 'moderate', 'challenging', 'extreme'] },
    { label: 'Duration', type: 'text' },
    { label: 'Minimum Age', type: 'number' },
    { label: 'Max Participants', type: 'number' },
    { label: 'Equipment Provided', type: 'boolean' },
    { label: 'Fitness Required', type: 'text' },
  ],
};
