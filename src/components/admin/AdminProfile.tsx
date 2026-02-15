import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

interface Profile {
  id: string;
  name: string;
  title: string;
  headline: string;
  bio: string | null;
  photo_url: string | null;
}

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  title: z.string().min(1, 'Title is required').max(100),
  headline: z.string().min(1, 'Headline is required').max(300),
  bio: z.string().max(2000).optional(),
});

interface AdminProfileProps {
  userId: string;
}

export const AdminProfile = ({ userId }: AdminProfileProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    headline: '',
    bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) {
      setLoading(false);
      setProfile(null);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          name: data.name,
          title: data.title,
          headline: data.headline,
          bio: data.bio || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);

    try {
      const profileData = {
        name: formData.name,
        title: formData.title,
        headline: formData.headline,
        bio: formData.bio || null,
        user_id: userId,
      };

      if (profile) {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', profile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert(profileData);
        if (error) throw error;
      }

      toast.success('Profile saved');
      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/photo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(fileName);

      if (profile) {
        const { error } = await supabase
          .from('profiles')
          .update({ photo_url: publicUrl })
          .eq('id', profile.id);
        if (error) throw error;
      }

      toast.success('Photo uploaded');
      fetchProfile();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
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
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">Profile</h2>
        <p className="text-muted-foreground mt-1">Manage your personal information</p>
      </div>

      {/* Photo upload */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div>
            <label className="btn-luxury rounded-md text-sm inline-flex items-center gap-2 cursor-pointer">
              <Upload size={16} />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`input-luxury ${errors.name ? 'border-destructive' : ''}`}
            placeholder="Your name"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`input-luxury ${errors.title ? 'border-destructive' : ''}`}
            placeholder="e.g. Full-Stack Developer"
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Headline</label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
            className={`input-luxury ${errors.headline ? 'border-destructive' : ''}`}
            placeholder="A short, impactful statement"
          />
          {errors.headline && <p className="text-sm text-destructive">{errors.headline}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="input-luxury resize-none"
            placeholder="Tell your story..."
            rows={6}
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSaving}
          className="btn-accent rounded-md inline-flex items-center gap-2 disabled:opacity-50"
          whileHover={{ scale: isSaving ? 1 : 1.02 }}
          whileTap={{ scale: isSaving ? 1 : 0.98 }}
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Profile'}
        </motion.button>
      </form>
    </div>
  );
};
