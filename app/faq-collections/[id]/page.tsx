'use client';

import { useState, useEffect } from 'react';
import { Upload, List, Grid, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FAQDisplay } from '@/components/ui/file-upload/FAQDisplay';

interface FileItem {
  id: string;
  filename: string;
  bytes: number;
  created_at: number;
  purpose: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function FaqCollectionPage({ params }: { params: { id: string } }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFaqs, setGeneratedFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    Promise.all([
      fetchFiles(),
      fetchExistingFaqs()
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [params.id]);

  const fetchExistingFaqs = async () => {
    try {
      const response = await fetch(`/api/faq_collections/${params.id}/faqs`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setGeneratedFaqs(data);
      } else {
        throw new Error('Invalid FAQ data received');
      }
    } catch (error) {
      console.error('Error fetching existing FAQs:', error);
    }
  };

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
      console.error('Error fetching files:', error);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      }
      if (prev.length >= 10) {
        alert('You can only select up to 10 files');
        return prev;
      }
      return [...prev, fileId];
    });
  };

  const handleGenerateFAQs = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileIds: selectedFiles,
          faq_collection_id: params.id
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate FAQs');
      }

      // Update the generated FAQs by appending new ones
      setGeneratedFaqs(prevFaqs => [...prevFaqs, ...data]);
      // Clear selection after successful generation
      setSelectedFiles([]);
      alert('FAQs generated successfully!');
    } catch (error) {
      console.error('Error generating FAQs:', error);
      alert('Failed to generate FAQs. Please try again.');
    } finally {
      setIsGenerating(false);
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
            <h1 className="text-3xl font-bold">Select Files for FAQ Generation</h1>
            <p className="text-muted-foreground mt-1">
              Choose up to 10 files to generate FAQs
            </p>
          </div>
          
          {/* View Toggle and Generate Button */}
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
            <Button
              onClick={handleGenerateFAQs}
              disabled={selectedFiles.length === 0 || isGenerating}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate FAQs'}
            </Button>
          </div>
        </div>

        {/* Selected Files Count */}
        {selectedFiles.length > 0 && (
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
              {selectedFiles.length === 10 && ' (maximum reached)'}
            </p>
          </div>
        )}

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
              <h3 className="text-xl font-semibold">No files available</h3>
              <p className="text-muted-foreground">
                Upload files in the Files section first
              </p>
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
                } ${
                  selectedFiles.includes(file.id)
                    ? 'border-primary border-2'
                    : ''
                } cursor-pointer`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-medium truncate">{file.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.bytes)} • {formatDate(file.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Generated FAQs Section */}
        {generatedFaqs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Generated FAQs
            </h3>
            <FAQDisplay faqs={generatedFaqs} />
          </div>
        )}
      </div>
    </main>
  );
}
