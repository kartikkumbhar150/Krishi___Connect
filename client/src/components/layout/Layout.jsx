import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faSeedling } from '@fortawesome/free-solid-svg-icons';

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      if (isMobileView !== isMobile) {
        setSidebarOpen(false);
      }

      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        sidebarOpen &&
        !event.target.closest('aside') &&
        !event.target.closest('button[aria-controls="sidebar"]')
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
    }, 240);

    return () => clearTimeout(timer);
  }, [children]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const pageTitle =
    location.pathname === '/dashboard'
      ? 'Dashboard'
      : location.pathname
          .replace('/', '')
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ') || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar isSidebarOpen={sidebarOpen} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm transition-opacity md:hidden"
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`flex-1 transition-all duration-300 ${
          isMobile ? 'ml-0' : isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                type="button"
                className="md:hidden inline-flex items-center p-2 text-sm rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 w-10 h-10 justify-center shadow"
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
                aria-label="Toggle sidebar"
              >
                <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} className="text-base" />
              </button>
              <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FontAwesomeIcon icon={faSeedling} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-slate-500">Krishi Connect</p>
                <h1 className="truncate text-base font-semibold text-slate-800 md:text-lg">{pageTitle}</h1>
              </div>
            </div>

            <LanguageSwitcher />
          </div>
        </header>

        <main className="p-3 md:p-6">
          <div
            className={`mx-auto transition-opacity duration-300 ${
              isPageTransitioning ? 'opacity-80' : 'opacity-100'
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
