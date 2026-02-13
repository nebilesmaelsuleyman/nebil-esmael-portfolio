import { useRef, useEffect } from 'react';
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
    techStack: ['Next.js', 'TypeScript', 'Mongodb', 'Stripe'],
    liveUrl: 'https://scoothub-e-commerceweb.onrender.com/',
    githubUrl: 'https://github.com/nebilesmaelsuleyman/ScootHub-E-commerceweb',
    gradient: 'from-sapphire/20 via-transparent to-transparent',
    imageUrl: 'https://res.cloudinary.com/ddu6q597d/image/upload/v1755233563/Screenshot_from_2026-02-13_17-52-35_lq1v7c.png'
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

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center project-slide`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Content */}
          <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
            <span className="text-8xl font-display font-bold text-border/50 block">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="space-y-6 -mt-12">
              <h3 className="text-4xl md:text-5xl font-display font-semibold text-foreground">
                {project.title}
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-4">
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
          <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = slidesContainerRef.current;
    if (!section || !container) return;

    const slides = gsap.utils.toArray<HTMLElement>('.project-slide', container);
    if (slides.length === 0) return;

    // Stack all slides on top of each other, only first visible
    slides.forEach((slide, i) => {
      gsap.set(slide, {
        opacity: i === 0 ? 1 : 0,
        y: i === 0 ? 0 : 60,
      });
    });

    // Create a timeline that crossfades between slides in place
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        // Each slide gets 1 viewport height of scroll distance
        end: () => `+=${slides.length * 100}%`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
      },
    });

    // For each slide transition, fade out current and fade in next
    slides.forEach((slide, i) => {
      if (i < slides.length - 1) {
        const next = slides[i + 1];
        tl.to(slide, { opacity: 0, y: -60, duration: 1, ease: 'power2.inOut' })
          .fromTo(
            next,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.inOut' },
            '<0.3'
          )
          // Add a pause/hold for each slide so user can read it
          .to({}, { duration: 0.5 });
      }
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative">
      {/* Pinned slides area with header overlay */}
      <div
        ref={slidesContainerRef}
        className="relative h-screen w-full bg-background"
      >
        {/* Header - positioned on top of first slide */}
        <div className="absolute inset-0 flex items-start justify-center z-20 pointer-events-none pt-16">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase block">
              Selected Work
            </span>
            <h2 className="section-title text-foreground mt-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
          </div>
        </div>

        {defaultProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
