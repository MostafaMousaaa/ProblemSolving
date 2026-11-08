import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { QuickRoleSwitcher } from './components/common/QuickRoleSwitcher';
import { Hero } from './components/home/Hero';
import { HowItWorks } from './components/home/HowItWorks';
import { FeaturedRoutes } from './components/home/FeaturedRoutes';
import { Benefits } from './components/home/Benefits';
import { FAQ } from './components/home/FAQ';
import { AboutView } from './components/about/AboutView';
import { ContactView } from './components/contact/ContactView';
import { ForStudentsView } from './components/portals/ForStudentsView';
import { ForDriversView } from './components/portals/ForDriversView';
import { StudentDashboard } from './components/student/StudentDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BookingModal } from './components/booking/BookingModal';
import { AuthModal } from './components/auth/AuthModal';
import { LegalModal } from './components/legal/LegalModal';
import { Trip, Booking, UserRole } from './types';

const MainApp: React.FC = () => {
  const { user, role, switchDemoRole } = useAuth();
  const { trips } = useData();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<Trip | null>(null);
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
    role?: 'student' | 'driver';
  }>({ isOpen: false, mode: 'login' });

  const [legalModalConfig, setLegalModalConfig] = useState<{
    isOpen: boolean;
    type: 'privacy' | 'terms';
  }>({ isOpen: false, type: 'privacy' });

  // Handle trip booking trigger
  const handleOpenBooking = (trip: Trip) => {
    setSelectedTripForBooking(trip);
  };

  // When a search is initiated from Hero
  const handleSearchFromHero = (params: { from: string; to: string; date: string; time: string; seats: number }) => {
    // Switch to student dashboard find-trip view or directly book matching trip
    if (user && role === 'student') {
      setCurrentTab('student-dashboard');
    } else {
      // Find matching trip or open first available
      const match = trips.find(t => t.fromLocation.includes('Tuba') || t.fromLocationAr.includes('طيبة')) || trips[0];
      if (match) {
        setSelectedTripForBooking(match);
      }
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register', targetRole: 'student' | 'driver' = 'student') => {
    setAuthModalConfig({ isOpen: true, mode, role: targetRole });
  };

  const handleAuthSuccess = (authenticatedRole: UserRole) => {
    if (authenticatedRole === 'driver') {
      setCurrentTab('driver-dashboard');
    } else if (authenticatedRole === 'admin') {
      setCurrentTab('admin-dashboard');
    } else {
      setCurrentTab('student-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* 1. Quick Interactive Demo Switcher Bar */}
      <QuickRoleSwitcher onNavigateTab={(tab) => setCurrentTab(tab)} />

      {/* 2. Main Sticky Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenAuth={(mode, targetRole) => handleOpenAuth(mode, targetRole)}
      />

      {/* 3. Page Body Switcher */}
      <div className="flex-1">
        {/* HOME VIEW */}
        {currentTab === 'home' && (
          <main>
            <Hero
              onSearch={handleSearchFromHero}
              onJoinDriver={() => handleOpenAuth('register', 'driver')}
              onFindJourney={() => {
                const target = trips[0];
                if (target) setSelectedTripForBooking(target);
              }}
            />
            <FeaturedRoutes
              onSelectRoute={(from, to) => {
                const match = trips.find(t => t.fromLocation.includes(from) || t.fromLocationAr.includes(from)) || trips[0];
                if (match) setSelectedTripForBooking(match);
              }}
            />
            <HowItWorks />
            <Benefits />
            <FAQ />
          </main>
        )}

        {/* HOW IT WORKS DEDICATED VIEW */}
        {currentTab === 'how-it-works' && (
          <main className="py-6">
            <HowItWorks />
            <Benefits />
            <FAQ />
          </main>
        )}

        {/* ROUTES VIEW */}
        {currentTab === 'routes' && (
          <main className="py-6">
            <FeaturedRoutes
              onSelectRoute={(from, to) => {
                const match = trips.find(t => t.fromLocation.includes(from) || t.fromLocationAr.includes(from)) || trips[0];
                if (match) setSelectedTripForBooking(match);
              }}
            />
          </main>
        )}

        {/* FOR STUDENTS DEDICATED VIEW */}
        {currentTab === 'for-students' && (
          <main>
            <ForStudentsView
              onSearchTrips={() => {
                if (user && role === 'student') {
                  setCurrentTab('student-dashboard');
                } else {
                  handleOpenAuth('login', 'student');
                }
              }}
              onOpenAuth={(mode) => handleOpenAuth(mode, 'student')}
            />
          </main>
        )}

        {/* FOR DRIVERS DEDICATED VIEW */}
        {currentTab === 'for-drivers' && (
          <main>
            <ForDriversView
              onOpenRegister={() => handleOpenAuth('register', 'driver')}
              onOpenDashboard={() => setCurrentTab('driver-dashboard')}
            />
          </main>
        )}

        {/* ABOUT VIEW */}
        {currentTab === 'about' && (
          <main>
            <AboutView />
          </main>
        )}

        {/* CONTACT VIEW */}
        {currentTab === 'contact' && (
          <main>
            <ContactView />
          </main>
        )}

        {/* STUDENT DASHBOARD */}
        {currentTab === 'student-dashboard' && (
          <main>
            <StudentDashboard
              onOpenBooking={(trip) => setSelectedTripForBooking(trip)}
              onLogout={() => {
                switchDemoRole('guest');
                setCurrentTab('home');
              }}
            />
          </main>
        )}

        {/* DRIVER DASHBOARD */}
        {currentTab === 'driver-dashboard' && (
          <main>
            <DriverDashboard
              onLogout={() => {
                switchDemoRole('guest');
                setCurrentTab('home');
              }}
            />
          </main>
        )}

        {/* ADMIN DASHBOARD */}
        {currentTab === 'admin-dashboard' && (
          <main>
            <AdminDashboard
              onLogout={() => {
                switchDemoRole('guest');
                setCurrentTab('home');
              }}
            />
          </main>
        )}
      </div>

      {/* 4. Global Footer */}
      <Footer
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenLegal={(type) => setLegalModalConfig({ isOpen: true, type })}
      />

      {/* 5. Booking Workflow Modal */}
      <BookingModal
        trip={selectedTripForBooking}
        isOpen={!!selectedTripForBooking}
        onClose={() => setSelectedTripForBooking(null)}
        onBookingComplete={() => {
          // If in student dashboard, stay there
        }}
      />

      {/* 6. Auth Modal (Student / Driver Login & Register) */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        initialMode={authModalConfig.mode}
        initialRole={authModalConfig.role || 'student'}
        onClose={() => setAuthModalConfig(prev => ({ ...prev, isOpen: false }))}
        onSuccess={handleAuthSuccess}
      />

      {/* 7. Legal Policy Modal */}
      <LegalModal
        isOpen={legalModalConfig.isOpen}
        type={legalModalConfig.type}
        onClose={() => setLegalModalConfig(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <MainApp />
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
