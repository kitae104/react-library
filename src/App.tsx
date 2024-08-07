import React from 'react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import LoginWidget from './Auth/LoginWidget';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBookPage } from './layouts/SearchBookPage/SearchBookPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { oktaConfig } from './lib/oktaConfig';
import { RequiredAuth } from './layouts/Utils/RequiredAuth';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { MangeLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';

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
            <Route path='/reviewlist/:bookId' element={<ReviewListPage />} />            
            <Route path="/checkout/:bookId" element={<BookCheckoutPage />} />
            <Route path="/login" element={<LoginWidget config={oktaConfig} />} />            
            <Route path='/login/callback' element={<LoginCallback />} />   
            <Route element={<RequiredAuth />}>
              <Route path="/shelf" element={<ShelfPage />} />     
              <Route path='/messages' element={<MessagesPage />} />  
              <Route path='/admin' element={<MangeLibraryPage />} />  
            </Route>
          </Routes>
        </div>
        <Footer />
      </Security>
    </div>

  );
}