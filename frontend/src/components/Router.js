import Header from './Header';
import Footer from './Footer';
import Upit from '../pages/Upit';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Contact from '../pages/Contact';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import KontaktDetalji from '../pages/KontaktDetalji';

export default function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as null to track loading state

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:4000/check-auth', {
        withCredentials: true,
      });
      setIsAuthenticated(response.data.isAuthenticated);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsAuthenticated(false); // If there's an error, set as unauthenticated
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const Layout = () => (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );

  const PrivateRoute = ({ children }) => {
    if (isAuthenticated === null) {
      return <div>Loading...</div>; 
    }
    return isAuthenticated ? children : <Navigate to="/signup" />;
  };

  const BrowserRouters = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Signup />} />
          <Route path="signup" element={<Signup />} />
          
          


          {/* Protected Routes */}
          <Route
            path="home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="contact"
            element={
              <PrivateRoute>
                <Contact />
              </PrivateRoute>
            }
          />
          <Route
            path="upit"
            element={
              <PrivateRoute>
                <Upit />
              </PrivateRoute>
            }
          />
          <Route
            path="kontakt/:broj"
            element={
              <PrivateRoute>
                <KontaktDetalji />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );

  return <BrowserRouters />;
}
