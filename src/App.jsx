import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navigation, { SidebarProvider } from './components/layout/Navigation';
import Footer from './components/layout/Footer';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Annapurna from './pages/Annapurna';
import AushadhMitra from './pages/AushadhMitra';
import CollegeSamagri from './pages/CollegeSamagri';
import NewListingWizard from './pages/NewListingWizard';
import Auth from './pages/Auth';
import ProfileSetup from './pages/ProfileSetup';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder_client_id';

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <SidebarProvider>
          <div className="app-container">
            {/* Global Noise Overlay */}
            <div className="global-noise"></div>
            
            <Navigation />
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/annapurna" element={<Annapurna />} />
                <Route path="/aushadh" element={<AushadhMitra />} />
                <Route path="/samagri" element={<CollegeSamagri />} />
                <Route path="/post" element={<NewListingWizard />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </SidebarProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
