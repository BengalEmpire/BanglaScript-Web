import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useSearchParams } from 'react-router-dom';
import { Toaster } from 'sonner';
import ApiProvider, { ApiContext } from './context/ApiContext';
import Home from './pages/Home';
import CreateProfile from './pages/CreateProfile';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/404';

const AppContent = () => {
  const { setUser } = useContext(ApiContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const error = searchParams.get('error');
    if (token && username) {
      setUser({ token, username });
      toast.success('Logged in successfully!');
    } else if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams, setUser]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-teal-900 via-blue-900 to-purple-900 text-white">
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateProfile />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <>
      <meta name="description" content="Discover and connect with talented developers worldwide." />
      <meta property="og:title" content="Developer Platform" />
      <meta property="og:description" content="Discover and connect with talented developers worldwide." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Developer Platform" />
      <meta name="twitter:description" content="Discover and connect with talented developers worldwide." />
      <ApiProvider>
        <Router>
          <AppContent />
        </Router>
      </ApiProvider>
    </>
  );
};

export default App;