import './App.css';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBookPage } from './layouts/SearchBookPage/SearchBookPage';

export const App = () => {
  return (
    <>
      <Navbar />
      {/* <HomePage />   */}    
      <SearchBookPage />
      <Footer />
    </>

  );
}