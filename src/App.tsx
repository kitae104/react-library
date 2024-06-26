import { Routes, Route } from 'react-router-dom';
import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBookPage } from './layouts/SearchBookPage/SearchBookPage';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';

export const App = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />
      <div className='flex-grow-1'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchBookPage />} />
          <Route path="/checkout/:bookId" element={<BookCheckoutPage />} />
        </Routes>
      </div>
      <Footer />
    </div>

  );
}