export type UserRole = 'Farmer' | 'Customer' | 'Provider' | 'Employee';
export type JobType = 'Full-Time' | 'Part-Time' | 'Gig' | 'Odd Job';
export type ListingStatus = 'Active' | 'Sold' | 'Barter Only';
export type ListingType = 'Fruit' | 'Veggie' | 'Meat' | 'Dairy' | 'Egg' | 'Grain' | 'Sweetener' | 'Textile' | 'Raw Material' | 'Other';
export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'Year-Round';

export interface UserName {
  first: string;
  last: string;
}

export interface UserInsurance {
  provider: string;
  policy: string;
}

// AgriID / CustID / ProvID / EmpID
export interface User {
  id: string; // e.g., user:john_doe
  role: UserRole; // Primary Role
  secondary_roles?: UserRole[]; // Supports "Customers may also represent providers"
  email: string;
  password?: string;
  dob?: string; 
  photo_url?: string; 
  name: UserName;
  farmer_id?: string; // PF-XXXXX (if role is Farmer)
  insurance?: UserInsurance;
  satisfaction_score?: number; 
  preferences?: string;
}

// FarmID
export interface Farm {
  id: string; // e.g., farm:valley_view
  // owner_id is deprecated in favor of WorksAt edge with role='Owner' to support "One Farm : Many Farmers"
  primary_contact_id?: string; 
  name: string;
  logo_url?: string; 
  location: [number, number]; 
  specialties: string[]; 
  paraphernalia?: string[]; 
}

export interface Listing {
  id: string;
  farm_id: string;
  name: string;
  type: ListingType; 
  season: Season; 
  price: string; 
  inventory: number;
  status: ListingStatus;
}

export interface JobPost {
  id: string;
  farm_id: string;
  title: string;
  description: string;
  type: JobType;
  compensation: string; 
}

export interface ISORequest {
  id: string;
  customer_id: string;
  item_name: string;
  category: ListingType; 
  description: string;
  quantity_needed: string;
  posted_at: string;
  expires_at: string;
  location: [number, number]; 
  trade_preference?: string; 
  urgency?: 'Low' | 'Medium' | 'High';
}

// SvcID
export interface ServiceListing {
  id: string;
  provider_id: string; 
  service_type: 'Veterinary' | 'Pesticide' | 'Herbicide' | 'Maintenance' | 'Other';
  name: string;
  description: string;
  contact_info: string;
  verified?: boolean; 
}

// Relationships (Edges)

export interface WorksAt {
  id: string;
  in: string; // user:ID (AgriID or EmpID)
  out: string; // farm:ID (FarmID)
  role: 'Owner' | 'Manager' | 'Employee'; // Distinguishes between Farmer and Employee
  started_at: string;
}

export interface ExchangeOffer {
  id: string;
  in: string; // user:ID
  out: string; // job_post:ID | listing:ID (Barter)
  offer_details: string;
}

export interface DatabaseState {
  users: User[];
  farms: Farm[];
  listings: Listing[];
  jobPosts: JobPost[];
  isoRequests: ISORequest[]; 
  services: ServiceListing[]; 
  worksAt: WorksAt[];
  exchangeOffers: ExchangeOffer[];
}