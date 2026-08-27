import React, { useCallback, useState } from "react";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
}

export function FileUploader({ onFileSelect, accept, maxSize = 5 }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setError(null);

      if (!file) {
        setSelectedFile(null);
        onFileSelect(null);
        return;
      }

      if (maxSize && file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [maxSize, onFileSelect]
  );

  const handleRemove = () => {
    setSelectedFile(null);
    onFileSelect(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/50 transition-colors">
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground mb-4">
            {accept ? `Accepted formats: ${accept}` : 'Any file format'} (Max: {maxSize}MB)
          </p>
          <label htmlFor="file-upload">
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer">
              Browse Files
            </span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
            />
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
          <div className="flex items-center space-x-3 overflow-hidden">
            <File className="h-8 w-8 text-blue-500 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
