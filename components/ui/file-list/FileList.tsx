'use client'

import { useEffect, useState } from 'react';
import { Trash2, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileData {
  id: string;
  filename: string;
  bytes: number;
  created_at: number;
  status: string;
}

export function FileList() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      if (data.success) {
        setFiles(data.files);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
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
        // Refresh the file list after successful deletion
        fetchFiles();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Uploaded Files</h2>
        <span className="text-sm text-gray-400">{files.length} files</span>
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No files uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/80 transition-colors duration-200"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-100 truncate" title={file.filename}>
                        {file.filename}
                      </h3>
                      <p className="text-sm text-gray-400">{formatFileSize(file.bytes)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-1.5 hover:bg-red-900/20 rounded-full transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-700 px-4 py-3 bg-gray-800/50 rounded-b-lg">
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(file.status)}
                    <span className="capitalize">{file.status}</span>
                  </div>
                  <time dateTime={new Date(file.created_at * 1000).toISOString()}>
                    {formatDate(file.created_at)}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 