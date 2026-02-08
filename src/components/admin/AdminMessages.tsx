import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Trash2, Check, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (message: Message) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: true })
        .eq('id', message.id);

      if (error) throw error;
      setMessages(prev =>
        prev.map(m => (m.id === message.id ? { ...m, is_read: true } : m))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Message deleted');
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Messages
          {unreadCount > 0 && (
            <span className="ml-3 text-sm font-normal px-2 py-1 rounded-full bg-primary/10 text-primary">
              {unreadCount} new
            </span>
          )}
        </h2>
        <p className="text-muted-foreground mt-1">Contact form submissions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Message list */}
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
              <motion.button
                key={message.id}
                onClick={() => openMessage(message)}
                className={`w-full text-left glass-card p-4 transition-colors ${
                  selectedMessage?.id === message.id
                    ? 'border-primary/50'
                    : 'hover:border-primary/30'
                } ${!message.is_read ? 'border-l-4 border-l-primary' : ''}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium truncate ${!message.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {message.name}
                      </p>
                      {!message.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {message.message}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Message detail */}
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 h-fit"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedMessage.name}</h3>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-primary hover:underline text-sm"
                >
                  {selectedMessage.email}
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteMessage(selectedMessage.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <a
                href={`mailto:${selectedMessage.email}`}
                className="btn-accent rounded-md text-sm inline-flex items-center gap-2"
              >
                <Mail size={16} />
                Reply via Email
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
