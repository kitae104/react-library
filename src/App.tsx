import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBookPage } from './layouts/SearchBookPage/SearchBookPage';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';

const oktaAuth = new OktaAuth(oktaConfig)


export const App = () => {

  

  const CustomAuthHandler = () => {
    const navigate = useNavigate();
    navigate('/login');
  }

  const RestoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    const navigate = useNavigate();
    navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });
  }

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={RestoreOriginalUri} onAuthRequired={CustomAuthHandler}>
        <Navbar />
        <div className='flex-grow-1'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchBookPage />} />
            <Route path="/checkout/:bookId" element={<BookCheckoutPage />} />
            <Route path="/login" element={<LoginWidget config={oktaConfig} />} />            
            <Route path='/login/callback' element={<LoginCallback />} />            
          </Routes>
        </div>
        <Footer />
      </Security>
    </div>

  );
}