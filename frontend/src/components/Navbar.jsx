import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  //  Hide navbar on scroll down
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //  Active link styles
  const navLink = (to, label) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsOpen(false)}
        className={`relative block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-indigo-100 text-indigo-700 font-semibold shadow-sm scale-105"
            : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      {/*  Navbar */}
      <nav
        className={`fixed w-full top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm transition-transform duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            <Link to="/">SlotSwapper</Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {navLink("/", "My Calendar")}
                {navLink("/market", "Marketplace")}
                {navLink("/requests", "Requests")}
                <button
                  onClick={logout}
                  className="ml-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink("/login", "Login")}
                {navLink("/register", "Register")}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown with slide-down animation */}
        <div
          className={`md:hidden bg-white border-t border-gray-200 shadow-md transform transition-all duration-300 origin-top ${
            isOpen
              ? "max-h-96 opacity-100 scale-y-100 animate-slideDown"
              : "max-h-0 opacity-0 scale-y-95"
          }`}
        >
          <div className="px-5 py-3 space-y-2">
            {user ? (
              <>
                {navLink("/", "My Calendar")}
                {navLink("/market", "Marketplace")}
                {navLink("/requests", "Requests")}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink("/login", "Login")}
                {navLink("/register", "Register")}
              </>
            )}
          </div>
        </div>
      </nav>

      {/*  Push content down to prevent overlap */}
      <div
        className={`transition-all duration-300 ${
          isOpen ? "h-72" : "h-16 md:h-20"
        }`}
      ></div>

      {/*  Slide-down animation (Tailwind inline keyframes) */}
      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: scaleY(0.95) translateY(-10px); }
          100% { opacity: 1; transform: scaleY(1) translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
