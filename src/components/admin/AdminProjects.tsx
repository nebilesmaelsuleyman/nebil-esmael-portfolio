import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ExternalLink, Github, GripVertical, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  display_order: number;
  is_visible: boolean;
}

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(2000),
  tech_stack: z.array(z.string()).min(1, 'Add at least one technology'),
  live_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
});

interface AdminProjectsProps {
  userId: string;
}

export const AdminProjects = ({ userId }: AdminProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    live_url: '',
    github_url: '',
    image_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    if (!userId) {
      setLoading(false);
      setProjects([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data ?? []);
    } catch (err: unknown) {
      const supabaseError = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : null;
      console.error('Error fetching projects:', err);
      toast.error(supabaseError || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        tech_stack: project.tech_stack.join(', '),
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        image_url: project.image_url || '',
      });
      setPreviewUrl(project.image_url);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        tech_stack: '',
        live_url: '',
        github_url: '',
        image_url: '',
      });
      setPreviewUrl(null);
    }
    setFile(null);
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const techStackArray = formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean);

    // Pass image validation if file is selected or already exists
    const result = projectSchema.safeParse({
      ...formData,
      tech_stack: techStackArray,
    });

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
      let finalImageUrl = formData.image_url;

      if (file) {
        setIsUploading(true);
        try {
          finalImageUrl = await uploadImage(file);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error('Failed to upload image');
          setIsSaving(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        tech_stack: techStackArray,
        live_url: formData.live_url || null,
        github_url: formData.github_url || null,
        image_url: finalImageUrl || null,
        user_id: userId,
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);
        if (error) throw error;
        toast.success('Project updated');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            ...projectData,
            display_order: projects.length,
          });
        if (error) throw error;
        toast.success('Project created');
      }

      closeModal();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_visible: !project.is_visible })
        .eq('id', project.id);
      if (error) throw error;
      fetchProjects();
      toast.success(project.is_visible ? 'Project hidden' : 'Project visible');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-foreground">Projects</h2>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          className="btn-accent rounded-md text-sm inline-flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Add Project
        </motion.button>
      </div>

      {/* Projects list */}
      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No projects yet. Add your first project to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-start gap-4">
                <div className="text-muted-foreground cursor-grab">
                  <GripVertical size={20} />
                </div>

                {project.image_url && (
                  <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                    {!project.is_visible && (
                      <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className="tech-badge text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  <button
                    onClick={() => toggleVisibility(project)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {project.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => openModal(project)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal - portaled to body so it's not clipped by parent overflow */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 bg-black/50 overflow-y-auto"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card w-full max-w-lg max-h-[85vh] min-h-0 flex flex-col rounded-lg shadow-xl overflow-hidden"
              >
                <div className="flex-shrink-0 px-8 pt-8 pb-4">
                  <h3 className="text-xl font-display font-semibold text-foreground">
                    {editingProject ? 'Edit Project' : 'Add Project'}
                  </h3>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-8" data-lenis-prevent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Project Image</label>
                      <div className="space-y-2">
                        {previewUrl && (
                          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFile(null);
                                setPreviewUrl(null);
                                setFormData(prev => ({ ...prev, image_url: '' }));
                              }}
                              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-muted-foreground
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className={`input-luxury ${errors.title ? 'border-destructive' : ''}`}
                        placeholder="Project title"
                      />
                      {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className={`input-luxury resize-none ${errors.description ? 'border-destructive' : ''}`}
                        placeholder="Project description"
                        rows={4}
                      />
                      {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Technologies</label>
                      <input
                        type="text"
                        value={formData.tech_stack}
                        onChange={(e) => setFormData(prev => ({ ...prev, tech_stack: e.target.value }))}
                        className={`input-luxury ${errors.tech_stack ? 'border-destructive' : ''}`}
                        placeholder="React, TypeScript, Node.js (comma-separated)"
                      />
                      {errors.tech_stack && <p className="text-sm text-destructive">{errors.tech_stack}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Live URL</label>
                      <input
                        type="url"
                        value={formData.live_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
                        className="input-luxury"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">GitHub URL</label>
                      <input
                        type="url"
                        value={formData.github_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                        className="input-luxury"
                        placeholder="https://github.com/..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 py-3 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        Cancel
                      </button>
                      <motion.button
                        type="submit"
                        disabled={isSaving || isUploading}
                        className="flex-1 btn-accent rounded-md disabled:opacity-50"
                        whileHover={{ scale: isSaving ? 1 : 1.01 }}
                        whileTap={{ scale: isSaving ? 1 : 0.99 }}
                      >
                        {isUploading ? 'Uploading...' : isSaving ? 'Saving...' : editingProject ? 'Update' : 'Create'}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
