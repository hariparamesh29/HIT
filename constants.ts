
import { 
  InquiryStatus, 
  FleetStatus, 
  PartyType, 
  ScrapRate, 
  CMSConfig, 
  Product, 
  Party, 
  Inquiry, 
  FleetTrip, 
  LedgerEntry 
} from './types';

export const INITIAL_CMS: CMSConfig = {
  companyName: "Hari Iron Traders",
  logoUrl: "https://picsum.photos/200/200?random=1",
  heroImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
  aboutHeroImageUrl: "https://images.unsplash.com/photo-1530124560676-587cabee2779?q=80&w=2000&auto=format&fit=crop",
  founderName: "Mr. Hari Krishnan",
  founderDescription: "With over 25 years of experience in the metal trading industry, Mr. Hari has built Hari Iron Traders into a name synonymous with trust and reliability in Coimbatore.",
  founderPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  founder2Name: "Mr. Rajesh Kumar",
  founder2Description: "A veteran in operational management, Mr. Rajesh ensures the seamless flow of heavy scrap from factory floors to our processing units with unmatched efficiency.",
  founder2PhotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
  coFounderName: "Mr. Sanjay Hari",
  coFounderPhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  coFounderDescription: "A visionary leader focused on modernizing the scrap supply chain with technology and efficient fleet management.",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "contact@hariirontraders.com",
  address: "123, Kovai Main Road, Pollachi, Coimbatore - 641001",
  whyHeading: "Built on Trust, Powered by Efficiency",
  whySubheading: "We stand out because we prioritize transparency and professional logistics in every single transaction.",
  whyPageTitle: "Why Choose Us",
  whyPageDescription: "Discover why Hari Iron Traders is the preferred partner for scrap trading and industrial disposal in Coimbatore.",
  benefits: [
    { id: 'b1', title: 'Own Godown & Transport', desc: 'Direct operations without middlemen, ensuring maximum value for your scrap.', icon: 'Factory', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop', enabled: true },
    { id: 'b2', title: 'Transparent Weighment', desc: 'Precision digital weighing systems with real-time slip generation.', icon: 'Weight', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop', enabled: true },
    { id: 'b3', title: 'Fast Pickup & Delivery', desc: 'Our dedicated fleet ensures same-day pickup for most industrial locations.', icon: 'Truck', imageUrl: 'https://images.unsplash.com/photo-1519003722824-192d992a6058?q=80&w=400&auto=format&fit=crop', enabled: true },
    { id: 'b4', title: 'Trusted Local Network', desc: 'Strong presence in the Coimbatore-Tirupur industrial corridor.', icon: 'CheckCircle2', imageUrl: 'https://images.unsplash.com/photo-1454165833767-131435bb4496?q=80&w=400&auto=format&fit=crop', enabled: true },
    { id: 'b5', title: 'Competitive Rates', desc: 'Daily updated pricing based on global metal market fluctuations.', icon: 'CheckCircle2', imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400&auto=format&fit=crop', enabled: true },
    { id: 'b6', title: 'Compliance & Safety', desc: 'Fully licensed operations following strict environmental guidelines.', icon: 'CheckCircle2', imageUrl: 'https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?q=80&w=400&auto=format&fit=crop', enabled: true },
  ],
  aboutStats: [
    { id: 's1', label: 'Years Exp', val: '25+', enabled: true },
    { id: 's2', label: 'Clients', val: '500+', enabled: true },
    { id: 's3', label: 'Daily Cap', val: '50T+', enabled: true },
    { id: 's4', label: 'Fleet', val: '12', enabled: true },
  ],
  team: [],
  products: [
    { id: 'p1', name: 'MS Heavy Scrap', description: 'Superior quality structural and heavy duty mild steel scrap.', imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=600&auto=format&fit=crop' },
    { id: 'p2', name: 'MS Light Scrap', description: 'Lightweight sheet metal and thin guage steel scraps.', imageUrl: 'https://images.unsplash.com/photo-1536633390841-832f2526274a?q=80&w=600&auto=format&fit=crop' },
    { id: 'p3', name: 'Structural Scrap', description: 'Girders, channels, and beams from industrial demolition.', imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=600&auto=format&fit=crop' },
    { id: 'p4', name: 'Iron Scrap', description: 'Standard industrial grade iron scrap for smelting.', imageUrl: 'https://images.unsplash.com/photo-1495314736024-fa5e4b37b979?q=80&w=600&auto=format&fit=crop' },
    { id: 'p5', name: 'Factory Disposal', description: 'End-to-end clearing of obsolete industrial machinery and structures.', imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop' },
  ],
  rates: [
    { id: '1', name: 'MS Heavy (Super)', rate: 38.50, unit: 'kg', enabled: true, order: 1 },
    { id: '2', name: 'MS Light (Lancing)', rate: 34.20, unit: 'kg', enabled: true, order: 2 },
    { id: '3', name: 'Cast Iron (CI)', rate: 42.00, unit: 'kg', enabled: true, order: 3 },
    { id: '4', name: 'SS 304 Scrap', rate: 125.00, unit: 'kg', enabled: true, order: 4 },
    { id: '5', name: 'Copper Scrap', rate: 710.00, unit: 'kg', enabled: true, order: 5 },
    { id: '6', name: 'Aluminum Utensil', rate: 165.00, unit: 'kg', enabled: true, order: 6 },
  ],
  showFounder: true,
  showFounder2: true,
  showCoFounder: true,
  showFounderDesc: true,
  showFounder2Desc: true,
  showCoFounderDesc: true,
  // Coverage Defaults
  showCoverageSection: true,
  coverageLabel: "Operational Coverage",
  coverageHeading: "Strategic Scrap Collection Across Coimbatore",
  coverageDescription: "Our logistics network enables fast scrap collection and efficient movement across industrial and commercial zones.",
  coverageAreas: ["Gandhipuram", "SIDCO Industrial Estate", "Pollachi", "Peelamedu", "Saravanampatti", "Kurumbapalayam"],
  activeVehicles: 2,
  operationalEfficiency: 85,
  updatedAt: Date.now()
};

export const INITIAL_RATES = INITIAL_CMS.rates;
export const INITIAL_PRODUCTS = INITIAL_CMS.products;

export const INITIAL_PARTIES: Party[] = [
  { id: 'par1', name: 'Kovai Steels Pvt Ltd', type: PartyType.BUYER, industry: 'Smelting', phone: '9000012345', whatsapp: '9000012345', address: 'SIDCO Industrial Estate, Coimbatore', status: 'Active' },
  { id: 'par2', name: 'Global Recyclers', type: PartyType.SUPPLIER, industry: 'Wholesale Scrap', phone: '9888877777', whatsapp: '9888877777', address: 'Tirupur Road, Palladam', status: 'Active' },
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  { id: 'i1', date: new Date().toISOString(), clientName: 'Ramesh Kumar', phone: '9123456789', whatsapp: '9123456789', product: 'MS Heavy Scrap', message: 'Need 5 tonnes delivered to Annur.', source: 'Website', status: InquiryStatus.NEW },
];

export const INITIAL_FLEET: FleetTrip[] = [
  { id: 't1', date: new Date().toISOString(), vehicleNumber: 'TN 37 AB 1234', partyId: 'par1', location: 'On the Way to Coimbatore', weight: 4.5, status: FleetStatus.ON_THE_WAY, notes: 'Direct delivery from vendor' },
];

export const INITIAL_LEDGER: LedgerEntry[] = [
  { id: 'l1', date: new Date().toISOString(), partyId: 'par2', type: 'Buy', itemName: 'MS Heavy Scrap', weight: 1000, rate: 38, amount: 38000 },
  { id: 'l2', date: new Date().toISOString(), partyId: 'par1', type: 'Sell', itemName: 'MS Heavy Scrap', weight: 1000, rate: 42, amount: 42000 },
];
