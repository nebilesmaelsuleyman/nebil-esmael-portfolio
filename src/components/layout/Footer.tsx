import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg font-display font-semibold tracking-tight text-foreground"
          >
            <span className="text-primary">{'<'}</span>
            NE
            <span className="text-primary">{'/>'}</span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-6"
          >
            <a
              href="https://github.com/nebilesmaelsuleyman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/nebil-esmael-85846b2b8/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:nebilesmaelsuleyman@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Mail size={20} />
            </a>
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground flex items-center gap-1"
          >
            © {currentYear} Nebil Esmael. Made with <Heart size={14} className="text-destructive" />
          </motion.p>
        </div>
      </div>
    </footer>
  );
};
