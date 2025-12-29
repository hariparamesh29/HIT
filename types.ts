
export enum InquiryStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  CLOSED = 'Closed'
}

export enum FleetStatus {
  LOADING = 'Loading',
  ON_THE_WAY = 'On the Way',
  UNLOADING = 'Unloading',
  COMPLETED = 'Completed'
}

export enum PartyType {
  BUYER = 'Buyer',
  SUPPLIER = 'Supplier',
  BOTH = 'Both'
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  active: boolean;
}

export interface WhyItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  imageUrl: string;
  enabled: boolean;
}

export interface StatItem {
  id: string;
  label: string;
  val: string;
  enabled: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  photoUrl: string;
  enabled: boolean;
  order: number;
}

export interface Inquiry {
  id: string;
  date: string;
  clientName: string;
  phone: string;
  whatsapp: string;
  product: string;
  message: string;
  source: string;
  status: InquiryStatus;
}

export interface Party {
  id: string;
  name: string;
  type: PartyType;
  industry: string;
  phone: string;
  whatsapp: string;
  address: string;
  status: 'Active' | 'Inactive';
}

export interface FleetTrip {
  id: string;
  date: string;
  vehicleNumber: string;
  partyId: string;
  location: string;
  weight: number;
  status: FleetStatus;
  notes: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  partyId: string;
  type: 'Buy' | 'Sell';
  itemName: string;
  weight: number;
  rate: number;
  amount: number;
}

export interface ScrapRate {
  id: string;
  name: string;
  rate: number;
  unit: string;
  enabled: boolean;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface CMSConfig {
  companyName: string;
  logoUrl: string;
  heroImageUrl: string;
  aboutHeroImageUrl: string;
  founderName: string;
  founderDescription: string;
  founderPhotoUrl: string;
  founder2Name: string;
  founder2Description: string;
  founder2PhotoUrl: string;
  coFounderName: string;
  coFounderPhotoUrl: string;
  coFounderDescription: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  whyHeading: string;
  whySubheading: string;
  whyPageTitle: string;
  whyPageDescription: string;
  benefits: WhyItem[];
  aboutStats: StatItem[];
  team: TeamMember[];
  products: Product[];
  rates: ScrapRate[];
  showFounder: boolean;
  showFounder2: boolean;
  showCoFounder: boolean;
  showFounderDesc: boolean;
  showFounder2Desc: boolean;
  showCoFounderDesc: boolean;
  // Coverage Section
  showCoverageSection: boolean;
  coverageLabel: string;
  coverageHeading: string;
  coverageDescription: string;
  coverageAreas: string[];
  activeVehicles: number;
  operationalEfficiency: number;
  // Versioning for sync
  updatedAt: number;
}
