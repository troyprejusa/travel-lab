import { useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { auth } from '@/auth/auth'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import TripLayout from '@/components/layout/TripLayout'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import TripsPage from '@/pages/TripsPage'
import TripOverviewPage from '@/pages/TripOverviewPage'
import ItineraryPage from '@/pages/ItineraryPage'
import PackingPage from '@/pages/PackingPage'
import PollsPage from '@/pages/PollsPage'
import MessagesPage from '@/pages/MessagesPage'
import TripSettingsPage from '@/pages/TripSettingsPage'
import AccountSettingsPage from '@/pages/AccountSettingsPage'
import NotFoundPage from '@/pages/NotFoundPage'

function ProtectedLayout({ signedIn }: { signedIn: boolean }) {
  const location = useLocation()
  return signedIn ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname + location.search + location.hash }} />
}

export default function App() {
  const [signedIn, setSignedIn] = useState(() => !!auth.getToken())
  const navigate = useNavigate()
  const location = useLocation()
  const appView = signedIn && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/sign-in'
  function signOut() { auth.signOut(); setSignedIn(false); navigate('/') }
  return <div className={appView ? "site-shell app-shell" : "site-shell"}>
    {appView ? <Sidebar onSignOut={signOut} /> : <Header signedIn={signedIn} onSignOut={signOut} />}
    <div className={appView ? "app-main" : undefined}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage onSignIn={() => setSignedIn(true)} />} />
      <Route path="/sign-in" element={<Navigate to="/login" replace />} />
      <Route element={<ProtectedLayout signedIn={signedIn} />}>
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/settings" element={<AccountSettingsPage />} />
        <Route path="/trips/:tripId" element={<TripLayout />}>
          <Route index element={<TripOverviewPage />} />
          <Route path="itinerary" element={<ItineraryPage />} />
          <Route path="packing" element={<PackingPage />} />
          <Route path="polls" element={<PollsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="travellers" element={<Navigate to=".." replace />} />
          <Route path="settings" element={<TripSettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    {!appView && <Footer />}
    </div>
  </div>
}
