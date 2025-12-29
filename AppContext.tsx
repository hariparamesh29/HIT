
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  CMSConfig, ScrapRate, Product, Party, Inquiry, FleetTrip, LedgerEntry,
  InquiryStatus, FleetStatus, AdminUser 
} from './types';
import { 
  INITIAL_CMS, INITIAL_PARTIES, 
  INITIAL_INQUIRIES, INITIAL_FLEET, INITIAL_LEDGER 
} from './constants';

interface AppContextType {
  cms: CMSConfig;
  draftCms: CMSConfig;
  setDraftCms: (cms: CMSConfig) => void;
  publishCms: () => void;
  parties: Party[];
  setParties: (parties: Party[]) => void;
  inquiries: Inquiry[];
  setInquiries: (inquiries: Inquiry[]) => void;
  fleet: FleetTrip[];
  setFleet: (fleet: FleetTrip[]) => void;
  ledger: LedgerEntry[];
  setLedger: (ledger: LedgerEntry[]) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => Promise<void>;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  admins: AdminUser[];
  addAdmin: (admin: Omit<AdminUser, 'id'>) => void;
  updateAdminStatus: (id: string, active: boolean) => void;
  changePassword: (username: string, current: string, next: string) => { success: boolean; message: string };
  toast: { message: string; type: 'success' | 'error' | null };
  showToast: (msg: string, type?: 'success' | 'error') => void;
  uploadToGoogleDrive: (base64: string) => Promise<string>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Backend Service Simulation (Google Drive & Sheets) ---

/**
 * Simulates uploading a file to Google Drive.
 * In a real production environment, this would be a fetch to a backend proxy 
 * that uses the Google Drive API to save the file and returns a public ID.
 */
const simulateGoogleDriveUpload = async (base64: string): Promise<string> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generating a persistent mock ID based on the file content for consistency
  const mockId = Math.random().toString(36).substring(2, 15);
  
  // Return the direct view-only Google Drive URL pattern requested
  // We keep the actual data in localStorage to simulate real persistence in this sandbox
  const driveUrl = `https://drive.google.com/uc?export=view&id=FILE_${mockId}`;
  
  // Storage for the "physical" file reference in our simulated backend
  const driveAssets = JSON.parse(localStorage.getItem('hari_drive_assets') || '{}');
  driveAssets[driveUrl] = base64;
  localStorage.setItem('hari_drive_assets', JSON.stringify(driveAssets));
  
  return driveUrl;
};

/**
 * Simulates appending a row to Google Sheets.
 */
const simulateGoogleSheetsAppend = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const sheetData = JSON.parse(localStorage.getItem('hari_google_sheets_log') || '[]');
  const row = {
    timestamp: new Date().toISOString(),
    ...data
  };
  sheetData.push(row);
  localStorage.setItem('hari_google_sheets_log', JSON.stringify(sheetData));
  console.log('✅ Data synced to Google Sheets:', row);
};

// --- Data Recovery Logic ---

const recoverData = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  if (!saved) return defaultValue;
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error(`Error recovering ${key}`, e);
    return defaultValue;
  }
};

const recoverCmsData = (key: string): CMSConfig => {
  const base = { ...INITIAL_CMS };
  const savedStr = localStorage.getItem(key);
  if (!savedStr) return base;
  
  try {
    const parsed = JSON.parse(savedStr);
    if (!parsed || typeof parsed !== 'object') return base;

    const result = { ...base, ...parsed };
    const collections: (keyof CMSConfig)[] = ['benefits', 'aboutStats', 'team', 'products', 'rates', 'coverageAreas'];
    collections.forEach(key => {
      const savedList = parsed[key];
      if (!Array.isArray(savedList) || savedList.length === 0) {
        (result as any)[key] = base[key];
      }
    });
    return result;
  } catch (e) {
    return base;
  }
};

// --- Context Provider ---

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('hari_auth') === 'true');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
  
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    return recoverData('hari_admins', [{
      id: 'primary-admin',
      name: 'Primary Admin',
      username: 'admin',
      passwordHash: 'admin123',
      active: true
    }]);
  });

  const [cms, setCms] = useState<CMSConfig>(() => recoverCmsData('hari_cms'));
  const [draftCms, setDraftCms] = useState<CMSConfig>(() => recoverCmsData('hari_draft_cms'));
  const [parties, setParties] = useState<Party[]>(() => recoverData('hari_parties', INITIAL_PARTIES));
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => recoverData('hari_inquiries', INITIAL_INQUIRIES));
  const [fleet, setFleet] = useState<FleetTrip[]>(() => recoverData('hari_fleet', INITIAL_FLEET));
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => recoverData('hari_ledger', INITIAL_LEDGER));

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  useEffect(() => {
    localStorage.setItem('hari_cms', JSON.stringify(cms));
    localStorage.setItem('hari_draft_cms', JSON.stringify(draftCms));
    localStorage.setItem('hari_parties', JSON.stringify(parties));
    localStorage.setItem('hari_inquiries', JSON.stringify(inquiries));
    localStorage.setItem('hari_fleet', JSON.stringify(fleet));
    localStorage.setItem('hari_ledger', JSON.stringify(ledger));
    localStorage.setItem('hari_admins', JSON.stringify(admins));
    localStorage.setItem('hari_auth', isAuthenticated.toString());
  }, [cms, draftCms, parties, inquiries, fleet, ledger, admins, isAuthenticated]);

  useEffect(() => {
    const handleSync = (e: StorageEvent) => {
      if (e.key === 'hari_cms') setCms(recoverCmsData('hari_cms'));
      if (e.key === 'hari_draft_cms') setDraftCms(recoverCmsData('hari_draft_cms'));
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const uploadToGoogleDrive = async (base64: string): Promise<string> => {
    return await simulateGoogleDriveUpload(base64);
  };

  const publishCms = () => {
    if (!draftCms.founderName?.trim() || !draftCms.coFounderName?.trim()) {
      showToast('Mandatory Founder/Co-Founder name missing.', 'error');
      return;
    }
    const updated = { ...draftCms, updatedAt: Date.now() };
    setDraftCms(updated);
    setCms(updated);
    showToast('Changes published successfully!', 'success');
  };

  const login = (username: string, pass: string) => {
    const user = admins.find(a => a.username === username && a.passwordHash === pass && a.active);
    if (user) {
      setIsAuthenticated(true);
      localStorage.setItem('hari_active_user', username);
      showToast(`Welcome back, ${user.name}`);
      return true;
    }
    showToast('Invalid credentials.', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hari_active_user');
    showToast('Logged out successfully');
  };

  const addAdmin = (data: Omit<AdminUser, 'id'>) => {
    const newAdmin: AdminUser = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setAdmins([...admins, newAdmin]);
    showToast('Admin created successfully');
  };

  const updateAdminStatus = (id: string, active: boolean) => {
    setAdmins(admins.map(a => a.id === id ? { ...a, active } : a));
    showToast(`Admin status ${active ? 'activated' : 'deactivated'}`);
  };

  const changePassword = (username: string, current: string, next: string) => {
    const adminIdx = admins.findIndex(a => a.username === username);
    if (adminIdx === -1) return { success: false, message: 'User not found.' };
    const admin = admins[adminIdx];
    if (admin.passwordHash !== current) return { success: false, message: 'Current password incorrect.' };
    if (next.length < 6) return { success: false, message: 'New password must be at least 6 characters.' };
    
    const newAdmins = [...admins];
    newAdmins[adminIdx] = { ...admin, passwordHash: next };
    setAdmins(newAdmins);
    showToast('Password updated successfully');
    return { success: true, message: 'Password updated successfully!' };
  };

  const addInquiry = async (data: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: InquiryStatus.NEW
    };
    
    // Save locally
    setInquiries([newInquiry, ...inquiries]);
    
    // Sync to Google Sheets
    try {
      await simulateGoogleSheetsAppend(newInquiry);
    } catch (err) {
      console.error('Failed to sync with Google Sheets backend', err);
    }
  };

  return (
    <AppContext.Provider value={{
      cms, draftCms, setDraftCms, publishCms,
      parties, setParties, inquiries, setInquiries, fleet, setFleet, ledger, setLedger,
      addInquiry, isAuthenticated, login, logout, changePassword, admins, addAdmin, updateAdminStatus,
      toast, showToast, uploadToGoogleDrive
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
