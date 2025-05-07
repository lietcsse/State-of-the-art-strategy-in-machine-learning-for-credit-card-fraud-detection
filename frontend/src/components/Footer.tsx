
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-fraud-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-white" />
              <span className="text-xl font-bold">CreditGuard</span>
            </div>
            <p className="text-fraud-blue-100 text-sm">
              Protecting your financial transactions with advanced machine learning fraud detection.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/analyze" className="text-fraud-blue-100 hover:text-white text-sm">
                  Transaction Analysis
                </Link>
              </li>
              <li>
                <Link to="/" className="text-fraud-blue-100 hover:text-white text-sm">
                  Fraud Detection
                </Link>
              </li>
              <li>
                <Link to="/" className="text-fraud-blue-100 hover:text-white text-sm">
                  Data Security
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-fraud-blue-100 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-fraud-blue-100 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-fraud-blue-100 hover:text-white text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-fraud-blue-100 text-sm">
                Email: srivyhnavi2204@gmail.com
              </li>
              <li className="text-fraud-blue-100 text-sm">
                Phone: +91 9398000000
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-fraud-blue-800">
          <p className="text-fraud-blue-100 text-sm text-center">
            &copy; {new Date().getFullYear()} CreditGuard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
