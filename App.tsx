
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';

// Public Views
import { Home } from './views/public/Home';
import { Products } from './views/public/Products';
import { About } from './views/public/About';
import { Contact } from './views/public/Contact';
import { WhyChooseUs } from './views/public/WhyChooseUs';
import { Login } from './views/public/Login';

// Admin Views
import { Dashboard } from './views/admin/Dashboard';
import { InquiryManager } from './views/admin/InquiryManager';
import { PartyMaster } from './views/admin/PartyMaster';
import { FleetTracker } from './views/admin/FleetTracker';
import { TradeLedger } from './views/admin/TradeLedger';
import { CMSManager } from './views/admin/CMSManager';
import { WhatsAppBroadcast } from './views/admin/WhatsAppBroadcast';
import { Reports } from './views/admin/Reports';

// Fix: Made children optional to resolve "Property 'children' is missing" errors in routing element context
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Fix: Removed React.FC to prevent potential issues with implicit children requirements in some @types/react versions
const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="about" element={<About />} />
        <Route path="why-choose-us" element={<WhyChooseUs />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="inquiries" element={<InquiryManager />} />
        <Route path="parties" element={<PartyMaster />} />
        <Route path="fleet" element={<FleetTracker />} />
        <Route path="ledger" element={<TradeLedger />} />
        <Route path="whatsapp" element={<WhatsAppBroadcast />} />
        <Route path="reports" element={<Reports />} />
        <Route path="cms" element={<CMSManager />} />
      </Route>
    </Routes>
  );
};

// Fix: Removed React.FC to satisfy strict type checking when used in root render without children
const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;