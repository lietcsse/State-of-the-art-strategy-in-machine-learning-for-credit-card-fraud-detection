import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-fraud-blue-600" />
              <span className="text-xl font-bold text-fraud-blue-800">CreditGuard</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-fraud-blue-800 hover:text-fraud-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/analyze">
              <Button variant="default" className="bg-fraud-blue-600 hover:bg-fraud-blue-700 text-white">
                Analyze Transactions
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-fraud-blue-800 hover:text-fraud-blue-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link 
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-fraud-blue-800 hover:bg-fraud-blue-50"
          >
            Home
          </Link>
          <Link 
            to="/analyze"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-fraud-blue-800 hover:bg-fraud-blue-50"
          >
            Analyze Transactions
          </Link>
          <Link to="/analyze">
            <Button variant="default" className="w-full mt-3 bg-fraud-blue-600 hover:bg-fraud-blue-700 text-white">
              Analyze Transactions
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
