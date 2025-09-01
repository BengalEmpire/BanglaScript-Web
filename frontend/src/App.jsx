import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import ApiProvider from './context/ApiContext';
import Home from './pages/Home';
import CreateProfile from './pages/CreateProfile';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/404';

const App = () => {
  return (
    <ApiProvider>
      <Router>
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
          {/* Toaster for notifications */}
          <Toaster richColors position="top-right" />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateProfile />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            {/* Fallback route for 404 */}
            <Route path="*" element={ <NotFound />} />
          </Routes>
        </div>
      </Router>
    </ApiProvider>
  );
};

export default App;