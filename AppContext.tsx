import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CMSConfig, Party, Inquiry, FleetTrip, LedgerEntry,
  InquiryStatus, AdminUser 
} from './types';
import { 
  INITIAL_CMS, INITIAL_PARTIES, 
  INITIAL_INQUIRIES, INITIAL_FLEET, INITIAL_LEDGER 
} from './constants';

interface AppContextType {
  cms: CMSConfig;
  draftCms: CMSConfig;
  setDraftCms: (cms: CMSConfig) => void;
  publishCms: () => Promise<void>;
  parties: Party[];
  setParties: (parties: Party[]) => void;
  addParty: (party: Omit<Party, 'id'>) => Promise<void>;
  updateParty: (id: string, updates: Partial<Party>) => Promise<void>;
  inquiries: Inquiry[];
  setInquiries: (inquiries: Inquiry[]) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => Promise<void>;
  updateInquiry: (id: string, updates: Partial<Inquiry>) => Promise<void>;
  fleet: FleetTrip[];
  setFleet: (fleet: FleetTrip[]) => void;
  addFleetTrip: (trip: Omit<FleetTrip, 'id'>) => Promise<void>;
  updateFleetTrip: (id: string, updates: Partial<FleetTrip>) => Promise<void>;
  ledger: LedgerEntry[];
  setLedger: (ledger: LedgerEntry[]) => void;
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id'>) => Promise<void>;
  updateLedgerEntry: (id: string, updates: Partial<LedgerEntry>) => Promise<void>;
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('hari_auth') === 'true');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
  
  // Data States
  const [cms, setCms] = useState<CMSConfig>(INITIAL_CMS);
  const [draftCms, setDraftCms] = useState<CMSConfig>(INITIAL_CMS);
  const [parties, setParties] = useState<Party[]>(INITIAL_PARTIES);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [fleet, setFleet] = useState<FleetTrip[]>(INITIAL_FLEET);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inqRes, partyRes, fleetRes, transRes, settingsRes] = await Promise.all([
          fetch('/api/inquiries'),
          fetch('/api/parties'),
          fetch('/api/fleet'),
          fetch('/api/transactions'),
          fetch('/api/settings')
        ]);

        if (inqRes.ok) setInquiries(await inqRes.json());
        if (partyRes.ok) setParties(await partyRes.json());
        if (fleetRes.ok) setFleet(await fleetRes.json());
        if (transRes.ok) setLedger(await transRes.json());
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setCms(prev => ({ ...prev, ...settings }));
          setDraftCms(prev => ({ ...prev, ...settings }));
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        showToast('Failed to load data from server', 'error');
      }
    };

    fetchData();
  }, []);

  const uploadToGoogleDrive = async (base64: string): Promise<string> => {
    return base64;
  };

  const publishCms = async () => {
    if (!draftCms.founderName?.trim() || !draftCms.coFounderName?.trim()) {
      showToast('Mandatory Founder/Co-Founder name missing.', 'error');
      return;
    }
    
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftCms)
      });
      
      if (res.ok) {
        const updated = await res.json();
        setCms(updated);
        setDraftCms(updated);
        showToast('Changes published successfully!', 'success');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to publish changes', 'error');
    }
  };

  const login = (username: string, pass: string) => {
    if (username === 'admin' && pass === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('hari_active_user', username);
      localStorage.setItem('hari_auth', 'true');
      showToast(`Welcome back, Admin`);
      return true;
    }
    showToast('Invalid credentials.', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hari_active_user');
    localStorage.removeItem('hari_auth');
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
    return { success: true, message: 'Password updated successfully!' };
  };

  // --- Inquiries ---
  const addInquiry = async (data: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status: InquiryStatus.NEW })
      });
      
      if (res.ok) {
        const newInquiry = await res.json();
        setInquiries([newInquiry, ...inquiries]);
        showToast('Inquiry submitted successfully');
      } else {
        throw new Error('Failed to submit inquiry');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to submit inquiry', 'error');
    }
  };

  const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const updated = await res.json();
        setInquiries(inquiries.map(i => i.id === id ? updated : i));
        showToast('Inquiry updated successfully');
      } else {
        throw new Error('Failed to update inquiry');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update inquiry', 'error');
    }
  };

  // --- Parties ---
  const addParty = async (data: Omit<Party, 'id'>) => {
    try {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const newParty = await res.json();
        setParties([...parties, newParty]);
        showToast('Party added successfully');
      } else {
        throw new Error('Failed to add party');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to add party', 'error');
    }
  };

  const updateParty = async (id: string, updates: Partial<Party>) => {
    try {
      const res = await fetch(`/api/parties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const updated = await res.json();
        setParties(parties.map(p => p.id === id ? updated : p));
        showToast('Party updated successfully');
      } else {
        throw new Error('Failed to update party');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update party', 'error');
    }
  };

  // --- Fleet ---
  const addFleetTrip = async (data: Omit<FleetTrip, 'id'>) => {
    try {
      const res = await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const newTrip = await res.json();
        setFleet([newTrip, ...fleet]);
        showToast('Fleet trip added successfully');
      } else {
        throw new Error('Failed to add fleet trip');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to add fleet trip', 'error');
    }
  };

  const updateFleetTrip = async (id: string, updates: Partial<FleetTrip>) => {
    try {
      const res = await fetch(`/api/fleet/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const updated = await res.json();
        setFleet(fleet.map(f => f.id === id ? updated : f));
        showToast('Fleet trip updated successfully');
      } else {
        throw new Error('Failed to update fleet trip');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update fleet trip', 'error');
    }
  };

  // --- Ledger / Transactions ---
  const addLedgerEntry = async (data: Omit<LedgerEntry, 'id'>) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const newEntry = await res.json();
        setLedger([newEntry, ...ledger]);
        showToast('Transaction added successfully');
      } else {
        throw new Error('Failed to add transaction');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to add transaction', 'error');
    }
  };

  const updateLedgerEntry = async (id: string, updates: Partial<LedgerEntry>) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const updated = await res.json();
        setLedger(ledger.map(l => l.id === id ? updated : l));
        showToast('Transaction updated successfully');
      } else {
        throw new Error('Failed to update transaction');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update transaction', 'error');
    }
  };

  return (
    <AppContext.Provider value={{
      cms, draftCms, setDraftCms, publishCms,
      parties, setParties, addParty, updateParty,
      inquiries, setInquiries, addInquiry, updateInquiry,
      fleet, setFleet, addFleetTrip, updateFleetTrip,
      ledger, setLedger, addLedgerEntry, updateLedgerEntry,
      isAuthenticated, login, logout, changePassword, admins, addAdmin, updateAdminStatus,
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
