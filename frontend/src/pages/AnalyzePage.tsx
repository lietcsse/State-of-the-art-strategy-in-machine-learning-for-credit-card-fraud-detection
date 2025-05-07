import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, FileText, Info, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";
import TransactionAnalytics from "@/components/TransactionAnalytics";
import { toast } from "@/components/ui/use-toast";
import { analyzeTransactions } from "@/api/fraudDetectionService";

const AnalyzePage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState("");

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setError("");
    
    try {
      // Call the API service to analyze the file
      const data = await analyzeTransactions(file);
      
      setAnalysisData(data);
      setAnalysisComplete(true);
      setActiveTab("results");
      
      toast({
        title: "Analysis Complete",
        description: `${file.name} has been analyzed successfully.`,
        duration: 5000,
      });
    } catch (err) {
      console.error("Error analyzing file:", err);
      setError(err.message || "Failed to analyze the file. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: err.message || "An error occurred while analyzing the file.",
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyze Credit Card Transactions</h1>
          <p className="text-gray-600">
            Upload your transaction CSV file to detect potential fraudulent activities using our machine
            learning algorithms.
          </p>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-fraud-blue-200">
          <Info className="h-4 w-4 text-fraud-blue-600" />
          <AlertTitle className="text-fraud-blue-800">CSV Format Information</AlertTitle>
          <AlertDescription className="text-fraud-blue-600">
            Your CSV file should contain transaction data with columns for transaction ID, date, amount,
            merchant, etc. For optimal results, include as much transaction detail as possible.
          </AlertDescription>
        </Alert>
        
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={isAnalyzing}>
              <FileText className="mr-2 h-4 w-4" />
              Upload Transactions
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisComplete}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Analysis Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Upload Transaction Data</h2>
                <p className="text-gray-600 text-sm">
                  Upload a CSV file containing your credit card transaction data to analyze for potential
                  fraud.
                </p>
              </div>
              
              <FileUploader
                onFileUpload={handleFileUpload}
                isLoading={isAnalyzing}
              />
              
              <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Privacy Notice</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      All data is processed securely. Your transaction data will not be stored permanently and
                      is only used for fraud detection analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            {analysisComplete && analysisData && (
              <div className="bg-white p-6 rounded-lg border">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>
                  <p className="text-gray-600 text-sm">
                    Our machine learning algorithms have analyzed your transaction data. Here are the
                    results:
                  </p>
                </div>
                <Separator className="my-6" />
                <TransactionAnalytics data={analysisData} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AnalyzePage;