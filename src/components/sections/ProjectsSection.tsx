import { useRef, useEffect, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description:
      'A full-featured e-commerce solution with real-time inventory management, secure payment processing, and an intuitive admin dashboard. Built for scale with microservices architecture.',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Redis'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    gradient: 'from-sapphire/20 via-transparent to-transparent',
  },
  {
    id: '2',
    title: 'Analytics Dashboard',
    description:
      'Enterprise analytics platform processing millions of events daily. Features real-time data visualization, custom reporting, and predictive analytics powered by machine learning.',
    techStack: ['React', 'Node.js', 'MongoDB', 'D3.js', 'TensorFlow'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    gradient: 'from-emerald/20 via-transparent to-transparent',
  },
  {
    id: '3',
    title: 'Collaboration Suite',
    description:
      'Real-time collaboration platform enabling teams to work together seamlessly. Includes document editing, video conferencing, and project management capabilities.',
    techStack: ['React', 'WebRTC', 'Socket.io', 'PostgreSQL', 'AWS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    gradient: 'from-primary/20 via-transparent to-transparent',
  },
];

const ProjectSlide = ({ project, index }: { project: Project; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const els = cardRef.current.querySelectorAll('.gsap-card-el');

    gsap.fromTo(
      els,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-panel h-screen w-full flex items-center justify-center relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Content */}
          <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
            <span className="gsap-card-el text-8xl font-display font-bold text-border/50 block">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="space-y-6 -mt-12">
              <h3 className="gsap-card-el text-4xl md:text-5xl font-display font-semibold text-foreground">
                {project.title}
              </h3>

              <p className="gsap-card-el text-lg text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              <div className="gsap-card-el flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="gsap-card-el flex items-center gap-4 pt-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury rounded-md text-sm px-6 py-3 inline-flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    View Live
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github size={18} />
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className={`gsap-card-el ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
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
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const panelsContainer = panelsContainerRef.current;
    if (!container || !panelsContainer) return;

    const panels = gsap.utils.toArray<HTMLElement>('.project-panel', panelsContainer);
    if (panels.length === 0) return;

    // Pin the container and scroll horizontally (vertically-feeling)
    const totalScroll = (panels.length - 1) * window.innerHeight;

    gsap.to(panelsContainer, {
      y: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section id="projects" ref={containerRef} className="relative overflow-hidden">
      {/* Section header */}
      <div ref={panelsContainerRef}>
        <div className="project-panel h-screen flex items-center justify-center">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <span className="gsap-card-el text-primary text-sm font-medium tracking-wider uppercase block">
              Selected Work
            </span>
            <h2 className="gsap-card-el section-title text-foreground mt-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="gsap-card-el section-subtitle mt-6 max-w-2xl mx-auto">
              A curated collection of projects that showcase my expertise in building scalable,
              performant, and beautiful web applications.
            </p>
          </div>
        </div>

        {defaultProjects.map((project, index) => (
          <ProjectSlide key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
