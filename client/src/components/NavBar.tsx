import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Building, Menu, X, ShoppingCart } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem("travelCart");
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        setCartItemsCount(cartItems.length);
      } catch (error) {
        console.error("Failed to parse cart:", error);
      }
    }
    
    // Listen for storage events to update cart count
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem("travelCart");
      if (updatedCart) {
        try {
          const cartItems = JSON.parse(updatedCart);
          setCartItemsCount(cartItems.length);
        } catch (error) {
          console.error("Failed to parse cart:", error);
        }
      } else {
        setCartItemsCount(0);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Check for changes every second (for same-window updates)
    const interval = setInterval(() => {
      handleStorageChange();
    }, 1000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
        });
      },
      onError: (error) => {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <a className="flex items-center">
                <span className="text-primary text-2xl font-bold font-heading">IndiaStay</span>
                <Building className="ml-2 text-secondary" />
              </a>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/hotels">
                <a className={`hover:text-primary font-semibold ${location === '/hotels' ? 'text-primary' : 'text-neutral-800'}`}>
                  Hotels
                </a>
              </Link>
              <Link href="/packages">
                <a className={`hover:text-primary font-semibold ${location === '/packages' ? 'text-primary' : 'text-neutral-800'}`}>
                  Packages
                </a>
              </Link>
              <Link href="/offers">
                <a className={`hover:text-primary font-semibold ${location === '/offers' ? 'text-primary' : 'text-neutral-800'}`}>
                  Offers
                </a>
              </Link>
              <Link href="/compare">
                <a className={`hover:text-primary font-semibold ${location.includes('/compare') ? 'text-primary' : 'text-neutral-800'}`}>
                  Compare
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <a className="relative flex items-center">
                <ShoppingCart className="text-neutral-800 hover:text-primary" size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </a>
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-neutral-800 font-medium hidden md:block">Welcome, {user.name}</span>
                <Link href="/profile">
                  <a className="text-primary hover:text-primary-dark font-semibold">
                    Profile
                  </a>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-primary hover:text-primary-dark font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <a className="text-primary hover:text-primary-dark font-semibold">Login</a>
                </Link>
                <Link href="/auth">
                  <a className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition">
                    Signup
                  </a>
                </Link>
              </>
            )}
            <button 
              className="md:hidden text-neutral-800"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-inner">
          <div className="container mx-auto px-4 py-2">
            <div className="flex justify-between">
              <Link href="/hotels">
                <a className="text-neutral-800 py-2 px-3 font-semibold text-center flex-1 hover:bg-neutral-100 rounded-md">
                  <i className="fas fa-hotel block mx-auto mb-1"></i>
                  Hotels
                </a>
              </Link>
              <Link href="/packages">
                <a className="text-neutral-800 py-2 px-3 font-semibold text-center flex-1 hover:bg-neutral-100 rounded-md">
                  <i className="fas fa-suitcase block mx-auto mb-1"></i>
                  Packages
                </a>
              </Link>
              <Link href="/offers">
                <a className="text-neutral-800 py-2 px-3 font-semibold text-center flex-1 hover:bg-neutral-100 rounded-md">
                  <i className="fas fa-tag block mx-auto mb-1"></i>
                  Offers
                </a>
              </Link>
              <Link href="/compare">
                <a className="text-neutral-800 py-2 px-3 font-semibold text-center flex-1 hover:bg-neutral-100 rounded-md">
                  <i className="fas fa-balance-scale block mx-auto mb-1"></i>
                  Compare
                </a>
              </Link>
              <Link href="/cart">
                <a className="text-neutral-800 py-2 px-3 font-semibold text-center flex-1 hover:bg-neutral-100 rounded-md relative">
                  <ShoppingCart className="mx-auto mb-1" size={16} />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-0 right-1/4 bg-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                  Cart
                </a>
              </Link>
              {user && (
                <>
                  <Link href="/profile">
                    <a className="text-neutral-800 py-2 px-3 font-semibold text-center flex-1 hover:bg-neutral-100 rounded-md">
                      <i className="fas fa-user block mx-auto mb-1"></i>
                      Profile
                    </a>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-neutral-800 py-2 px-3 font-semibold text-center flex-1 hover:bg-neutral-100 rounded-md"
                  >
                    <i className="fas fa-sign-out-alt block mx-auto mb-1"></i>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
