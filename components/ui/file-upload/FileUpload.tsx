'use client'

import React, { useState } from 'react';
import { FileUploadButton } from './FileUploadButton';
import { FileList } from './FileList';

export const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleFileSelect = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileDelete = (fileToDelete: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/faqs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      showNotification('File uploaded and processed successfully', 'success');
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('Failed to upload file', 'error');
      throw error;
    }
  };

  const handleProcessFiles = async () => {
    setIsUploading(true);
    try {
      for (const file of files) {
        await handleUpload(file);
      }
      setFiles([]); // Clear files after successful upload
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          } transition-opacity duration-300 ${
            notification.show ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {notification.message}
        </div>
      )}
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          Upload Files
        </h2>
        <p className="mt-2 text-gray-400">
          Select files to analyze and create FAQs
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800">
        <div className="flex flex-col items-center">
          <FileUploadButton onFileSelect={handleFileSelect} />
          {files.length > 0 && (
            <div className="w-full mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-200">
                  Uploaded Files
                </h3>
                <span className="text-sm text-gray-400">
                  {files.length} file{files.length !== 1 ? 's' : ''}
                </span>
              </div>
              <FileList files={files} onDelete={handleFileDelete} />
              <button
                onClick={handleProcessFiles}
                disabled={isUploading}
                className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isUploading ? 'Processing...' : 'Process Files'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
