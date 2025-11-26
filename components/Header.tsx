
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import Button from './Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5 lg:py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl font-bold transition-colors ${
              isScrolled ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'
            }`}>
              +
            </div>
            <span className={`text-2xl font-serif font-bold ${
              isScrolled ? 'text-gray-900' : 'text-gray-900 lg:text-white'
            }`}>
              City General
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium hover:text-primary-500 transition-colors ${
                  location.pathname === link.path 
                    ? 'text-primary-500' 
                    : isScrolled ? 'text-gray-600' : 'text-white/90'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <div className={`flex items-center gap-2 font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
              <Phone size={18} />
              <span>(555) 123-4567</span>
            </div>
            <Link to="/appointment">
              <Button variant={isScrolled ? 'primary' : 'white'} size="sm">
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`lg:hidden p-2 rounded-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900 lg:text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-30 transform transition-transform duration-300 lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{ top: '0', paddingTop: '80px' }}>
        <div className="container mx-auto px-4 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xl font-medium border-b border-gray-100 pb-4 ${
                location.pathname === link.path ? 'text-primary-600' : 'text-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-4">
            <Link to="/appointment" className="w-full">
              <Button className="w-full flex items-center justify-center gap-2">
                <Calendar size={18} /> Book Appointment
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-2 text-gray-600 font-medium py-3 bg-gray-50 rounded-lg">
              <Phone size={18} /> Emergency: 911
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
