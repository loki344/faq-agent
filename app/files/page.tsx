'use client';

import { useState, useEffect } from 'react';
import { Upload, List, Grid, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileItem {
  id: string;
  filename: string;
  bytes: number;
  created_at: number;
  purpose: string;
}

export default function FilesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.files);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      // toast({
      //   title: "Error fetching files",
      //   description: error instanceof Error ? error.message : "Failed to load files",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        // toast({
        //   title: "Success",
        //   description: "File uploaded successfully",
        // });
        fetchFiles(); // Refresh the files list
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      // toast({
      //   title: "Upload failed",
      //   description: error instanceof Error ? error.message : "Failed to upload file",
      //   variant: "destructive",
      // });
    }
    
    // Reset the input
    event.target.value = '';
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch('/api/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFiles(files.filter(file => file.id !== fileId));
        // toast({
        //   title: "Success",
        //   description: "File deleted successfully",
        // });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      // toast({
      //   title: "Delete failed",
      //   description: error instanceof Error ? error.message : "Failed to delete file",
      //   variant: "destructive",
      // });
    }
  };

  // Helper function to format bytes to human readable size
  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  // Helper function to format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Files</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize your uploaded files
            </p>
          </div>
          
          {/* View Toggle and Upload Button */}
          <div className="flex gap-4">
            <div className="flex bg-secondary rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
                multiple
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </label>
              </Button>
            </div>
          </div>
        </div>

        {/* Files Display Section */}
        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              <p className="text-muted-foreground">Loading files...</p>
            </div>
          </Card>
        ) : files.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No files uploaded yet</h3>
              <p className="text-muted-foreground">
                Upload your first file to get started
              </p>
              <Button asChild variant="secondary">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Upload Files
                </label>
              </Button>
            </div>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-2'}>
            {files.map((file) => (
              <Card
                key={file.id}
                className={`${
                  viewMode === 'grid'
                    ? 'p-4 flex flex-col'
                    : 'p-4 flex items-center justify-between'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-medium truncate">{file.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.bytes)} • {formatDate(file.created_at)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteFile(file.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
