import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";

interface FileUploadButtonProps {
  onFileSelect: (files: FileList) => void;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
      <Button
        onClick={handleClick}
        variant="default"
        className="relative cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
        size="lg"
      >
        <Cloud className="mr-2 h-4 w-4" />
        Upload Files
      </Button>
    </div>
  );
};
