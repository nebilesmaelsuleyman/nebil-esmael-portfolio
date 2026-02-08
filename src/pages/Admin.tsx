import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  User, 
  MessageSquare,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';
import { AdminProjects } from '@/components/admin/AdminProjects';
import { AdminProfile } from '@/components/admin/AdminProfile';
import { AdminCV } from '@/components/admin/AdminCV';
import { AdminMessages } from '@/components/admin/AdminMessages';

type AdminTab = 'projects' | 'profile' | 'cv' | 'messages';

const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'projects', label: 'Projects', icon: <FolderKanban size={20} /> },
  { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  { id: 'cv', label: 'CV', icon: <FileText size={20} /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
];

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
        
        if (!session) {
          navigate('/auth');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col lg:translate-x-0 transition-transform duration-300`}
        style={{ transform: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'none' : undefined }}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border">
          <a href="/" className="text-xl font-display font-semibold text-foreground">
            <span className="text-primary">{'<'}</span>
            Admin
            <span className="text-primary">{'/>'}</span>
          </a>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {session.user.email}
              </p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 border-b border-border flex items-center px-6 gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-foreground capitalize">
            {activeTab}
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {activeTab === 'projects' && <AdminProjects userId={session.user.id} />}
          {activeTab === 'profile' && <AdminProfile userId={session.user.id} />}
          {activeTab === 'cv' && <AdminCV userId={session.user.id} />}
          {activeTab === 'messages' && <AdminMessages />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
