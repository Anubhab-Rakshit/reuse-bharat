import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
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
            </Routes>
          </main>

          <Footer />
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;
