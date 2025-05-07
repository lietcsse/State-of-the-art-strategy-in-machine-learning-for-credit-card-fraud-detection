import { Shield, CreditCard, ChevronRight, AlertTriangle, Search, Server, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-fraud-blue-800 to-fraud-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Protect Your Credit Cards from Fraud with Machine Learning
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Upload your transaction data and instantly detect suspicious activities with our advanced ML algorithms.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/analyze">
                  <Button className="w-full sm:w-auto bg-white text-fraud-blue-800 hover:bg-blue-50 text-lg px-8 py-3 rounded-md">
                    Analyze Transactions
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-48 h-48 text-fraud-blue-100 opacity-20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center animate-pulse-slow">
                  <CreditCard className="w-36 h-36 text-white" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 rounded-full border-4 border-fraud-blue-400 opacity-20 animate-spin" style={{ animationDuration: '15s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Fraud Detection Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform uses sophisticated machine learning algorithms to identify patterns and detect anomalies in your transaction data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-fraud-blue-50 p-8 rounded-lg border border-fraud-blue-100">
              <div className="bg-fraud-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-fraud-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analyze Transactions</h3>
              <p className="text-gray-600">
                Upload your CSV file containing transaction data and our system will perform a comprehensive analysis.
              </p>
            </div>
            
            <div className="bg-fraud-blue-50 p-8 rounded-lg border border-fraud-blue-100">
              <div className="bg-fraud-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Server className="h-8 w-8 text-fraud-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">ML Detection</h3>
              <p className="text-gray-600">
                Our advanced machine learning models detect patterns and identify potential fraudulent activities.
              </p>
            </div>
            
            <div className="bg-fraud-blue-50 p-8 rounded-lg border border-fraud-blue-100">
              <div className="bg-fraud-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-fraud-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Alerts</h3>
              <p className="text-gray-600">
                Receive detailed reports and alerts on suspicious transactions that require your attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Data Security Is Our Priority</h2>
              <p className="text-lg text-gray-600 mb-6">
                We take your privacy seriously. All data uploaded to our platform is encrypted and processed securely.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Lock className="h-5 w-5 text-fraud-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600">End-to-end encryption for all uploaded data</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Lock className="h-5 w-5 text-fraud-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600">Data is never stored permanently on our servers</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Lock className="h-5 w-5 text-fraud-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600">Compliance with global data protection regulations</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-fraud-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-32 w-32 text-fraud-blue-600" />
                </div>
                <div className="absolute top-0 right-0 bg-white p-3 rounded-full shadow-lg">
                  <Lock className="h-8 w-8 text-fraud-blue-600" />
                </div>
                <div className="absolute bottom-0 left-0 bg-white p-3 rounded-full shadow-lg">
                  <CreditCard className="h-8 w-8 text-fraud-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-fraud-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Credit Card Transactions?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Upload your transaction data and get instant fraud detection analysis powered by machine learning.
          </p>
          <Link to="/analyze">
            <Button className="bg-white text-fraud-blue-800 hover:bg-blue-50 text-lg px-8 py-3 rounded-md">
              Start Analyzing Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
