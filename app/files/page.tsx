import { FileUpload } from '@/components/ui/file-upload/FileUpload';
import { FileList } from '@/components/ui/file-list/FileList';

export default function FilesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FileUpload />
        <FileList />
      </div>
    </main>
  );
}
