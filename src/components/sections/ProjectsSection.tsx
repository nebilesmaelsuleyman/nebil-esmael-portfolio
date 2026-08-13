import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/integrations/supabase/client';


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

interface ImageErrorState {
  [key: string]: boolean;
}

const gradients = [
  'from-sapphire/20 via-transparent to-transparent',
  'from-emerald/20 via-transparent to-transparent',
  'from-primary/20 via-transparent to-transparent',
  'from-purple-500/20 via-transparent to-transparent',
  'from-orange-500/20 via-transparent to-transparent'
];

const ProjectCard = memo(({ project, index, imageErrors, onImageError }: { project: Project; index: number; imageErrors: ImageErrorState; onImageError: (id: string) => void }) => {
  const handleImageError = useCallback(() => {
    onImageError(project.id);
  }, [project.id, onImageError]);

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
              {project.imageUrl && !imageErrors[project.id] ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
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
});

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<ImageErrorState>({});

  // Handle image error
  const handleImageError = useCallback((projectId: string) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }));
  }, []);

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects?is_visible=true`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();

        if (data && data.length > 0) {
          const mappedProjects: Project[] = data.map((p, index) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            techStack: p.tech_stack || [],
            liveUrl: p.live_url || undefined,
            githubUrl: p.github_url || undefined,
            imageUrl: p.image_url || undefined,
            // Assign gradients cyclically based on index
            gradient: gradients[index % gradients.length]
          }));
          setProjects(mappedProjects);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // GSAP Animation setup
  useEffect(() => {
    // Only run animation setup if we are not loading or if we fell back to default projects
    const initGSAP = () => {
      const section = sectionRef.current;
      const container = slidesContainerRef.current;
      if (!section || !container) return;

      const slides = gsap.utils.toArray<HTMLElement>('.project-slide', container);
      if (slides.length === 0) return;

      // Reset any previous GSAP settings
      ScrollTrigger.getAll().forEach(st => st.kill());

      // Stack all slides on top of each other, only first visible
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          autoAlpha: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 60,
          zIndex: i === 0 ? 10 : 1,
        });
      });

      // Create a timeline that crossfades between slides in place
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${slides.length * 100}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Optional: for tracking
          }
        },
      });

      // For each slide transition, fade out current and fade in next
      slides.forEach((slide, i) => {
        if (i < slides.length - 1) {
          const next = slides[i + 1];
          tl.to(slide, {
            autoAlpha: 0,
            y: -60,
            zIndex: 1,
            duration: 1,
            ease: 'power2.inOut'
          })
            .fromTo(
              next,
              { autoAlpha: 0, y: 60, zIndex: 1 },
              { autoAlpha: 1, y: 0, zIndex: 10, duration: 1, ease: 'power2.inOut' },
              '<0.3'
            )
            .to({}, { duration: 0.5 });
        }
      });

      // Force refresh after a small delay to ensure all layouts are calculated
      ScrollTrigger.refresh();

      return tl;
    };

    let timeline: gsap.core.Timeline | undefined;
    const timer = setTimeout(() => {
      timeline = initGSAP();
    }, 500); // Increased delay for better stability

    // Also refresh on window load and resize
    window.addEventListener('load', () => ScrollTrigger.refresh());
    window.addEventListener('resize', () => ScrollTrigger.refresh());

    return () => {
      clearTimeout(timer);
      if (timeline) timeline.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
      window.removeEventListener('load', () => ScrollTrigger.refresh());
      window.removeEventListener('resize', () => ScrollTrigger.refresh());
    };
  }, [projects, loading]); // Added loading to dependencies

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

        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index}
            imageErrors={imageErrors}
            onImageError={handleImageError}
          />
        ))}
      </div>
    </section>
  );
};
