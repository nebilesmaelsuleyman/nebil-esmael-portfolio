import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CVFile {
  id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

interface AdminCVProps {
  userId: string;
}

export const AdminCV = ({ userId }: AdminCVProps) => {
  const [cvFile, setCVFile] = useState<CVFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCV();
  }, [userId]);

  const fetchCV = async () => {
    if (!userId) {
      setLoading(false);
      setCVFile(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cv/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch CV');
      const data = await res.json();
      setCVFile(data || null);
    } catch (error) {
      console.error('Error fetching CV:', error);
      toast.error('Failed to load CV');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!uploadRes.ok) throw new Error('Failed to upload CV file');
      const uploadData = await uploadRes.json();
      const publicUrl = uploadData.url;

      const saveRes = await fetch('http://localhost:5000/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          file_url: publicUrl,
          file_name: file.name,
        })
      });
      if (!saveRes.ok) throw new Error('Failed to save CV info');

      toast.success('CV uploaded successfully');
      fetchCV();
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error('Failed to upload CV');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!cvFile) return;
    if (!confirm('Are you sure you want to delete your CV?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cv/${cvFile.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete CV');

      toast.success('CV deleted');
      setCVFile(null);
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('Failed to delete CV');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">CV / Resume</h2>
        <p className="text-muted-foreground mt-1">Upload your CV for visitors to download</p>
      </div>

      {/* Upload area */}
      <div className="glass-card p-8">
        {cvFile ? (
          <div className="space-y-6">
            {/* Current file */}
            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{cvFile.file_name}</p>
                <p className="text-sm text-muted-foreground">
                  Uploaded {new Date(cvFile.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={cvFile.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Download size={20} />
                </a>
                <button
                  onClick={handleDelete}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Replace */}
            <label className="btn-luxury rounded-md text-sm inline-flex items-center gap-2 cursor-pointer">
              <Upload size={16} />
              Replace CV
              <input
                type="file"
                accept=".pdf"
                onChange={handleUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground font-medium mb-1">
              {isUploading ? 'Uploading...' : 'Upload your CV'}
            </p>
            <p className="text-sm text-muted-foreground">PDF up to 10MB</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
};
