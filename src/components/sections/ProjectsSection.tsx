import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronDown } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  gradient: string;
}

// Default demo projects
const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce solution with real-time inventory management, secure payment processing, and an intuitive admin dashboard. Built for scale with microservices architecture.',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Redis'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    gradient: 'from-sapphire/20 via-transparent to-transparent',
  },
  {
    id: '2',
    title: 'Analytics Dashboard',
    description: 'Enterprise analytics platform processing millions of events daily. Features real-time data visualization, custom reporting, and predictive analytics powered by machine learning.',
    techStack: ['React', 'Node.js', 'MongoDB', 'D3.js', 'TensorFlow'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    gradient: 'from-emerald/20 via-transparent to-transparent',
  },
  {
    id: '3',
    title: 'Collaboration Suite',
    description: 'Real-time collaboration platform enabling teams to work together seamlessly. Includes document editing, video conferencing, and project management capabilities.',
    techStack: ['React', 'WebRTC', 'Socket.io', 'PostgreSQL', 'AWS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    gradient: 'from-primary/20 via-transparent to-transparent',
  },
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="scroll-snap-section relative flex items-center justify-center"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Content */}
          <motion.div
            style={{ y }}
            className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
          >
            {/* Project number */}
            <span className="text-8xl font-display font-bold text-border/50">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="space-y-6 -mt-12">
              <h3 className="text-4xl md:text-5xl font-display font-semibold text-foreground">
                {project.title}
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-4 pt-4">
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury rounded-md text-sm px-6 py-3 inline-flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink size={16} />
                    View Live
                  </motion.a>
                )}
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github size={18} />
                    Source Code
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Project visual placeholder */}
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
            className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden glass-card">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-secondary via-card to-secondary flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-border flex items-center justify-center">
                      <ExternalLink size={24} className="text-primary" />
                    </div>
                    <p className="text-sm">Project Preview</p>
                  </div>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator for next project */}
      {index < defaultProjects.length - 1 && (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        >
          <ChevronDown size={24} />
        </motion.div>
      )}
    </motion.div>
  );
};

export const ProjectsSection = () => {
  return (
    <section id="projects" className="relative">
      {/* Section header */}
      <div className="min-h-screen flex items-center justify-center scroll-snap-section">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-medium tracking-wider uppercase"
          >
            Selected Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="section-title text-foreground mt-4"
          >
            Featured <span className="text-gradient">Projects</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="section-subtitle mt-6 max-w-2xl mx-auto"
          >
            A curated collection of projects that showcase my expertise in building 
            scalable, performant, and beautiful web applications.
          </motion.p>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="mt-12 text-muted-foreground"
          >
            <ChevronDown size={32} className="mx-auto" />
          </motion.div>
        </div>
      </div>

      {/* Project cards */}
      {defaultProjects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </section>
  );
};
