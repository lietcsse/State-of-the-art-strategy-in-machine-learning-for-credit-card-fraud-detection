
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUploader = ({ onFileUpload, isLoading }: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check if it's a CSV file
    if (!file.name.endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Please upload a CSV file",
        duration: 3000,
      });
      return false;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        duration: 3000,
      });
      return false;
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        toast({
          title: "File selected",
          description: `${file.name} is ready for upload`,
          duration: 3000,
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        toast({
          title: "File selected",
          description: `${file.name} is ready for upload`,
          duration: 3000,
        });
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    } else {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a CSV file first",
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          ${dragActive ? "border-fraud-blue-500 bg-fraud-blue-50" : "border-gray-300"}
          ${selectedFile ? "bg-fraud-blue-50 border-fraud-blue-300" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        
        {selectedFile ? (
          <div>
            <div className="flex justify-center mb-4">
              <div className="bg-fraud-blue-100 rounded-full p-3">
                <Check className="h-6 w-6 text-fraud-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-fraud-blue-700 mb-2">File selected</p>
            <p className="mb-4 text-gray-500 truncate max-w-full">{selectedFile.name}</p>
            <Button 
              variant="default" 
              className="bg-fraud-blue-600 hover:bg-fraud-blue-700"
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Analyze Transactions"}
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 rounded-full p-3">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            <p className="mb-2 text-sm font-medium text-gray-500">
              Drag and drop your CSV file here
            </p>
            <p className="mb-4 text-xs text-gray-400">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              Only CSV files are supported (max 10MB)
            </p>
            <Button 
              variant="outline" 
              onClick={handleButtonClick}
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
