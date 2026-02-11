import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import developerPhoto from '@/assets/insuit3.png';

gsap.registerPlugin(ScrollTrigger);

const skills = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS',],
  backend: ['Node.js', 'Express.js', 'Eliysiajs', , 'Nestjs'],
  database: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma'],
  tools: ['Git', 'GitHub', 'Docker', 'CI/CD', , 'Vercel'],
};


export const AboutSection = () => {
  const photoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!photoRef.current || !contentRef.current) return;

    gsap.fromTo(
      photoRef.current,
      { opacity: 0, x: -120 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: photoRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    const els = contentRef.current.querySelectorAll('.gsap-about-el');
    gsap.fromTo(
      els,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <section id="about" className="min-h-screen py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Photo */}
          <div ref={photoRef} className="relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 border border-primary/30 rounded-lg -translate-x-4 -translate-y-4" />
              <div className="relative h-full rounded-lg overflow-hidden glass-card">
                <img
                  src={developerPhoto}
                  alt="Nebil Esmael - Full-Stack Developer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border border-accent/30 rounded-lg" />
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            <span className="gsap-about-el text-primary text-sm font-medium tracking-wider uppercase">
              About Me
            </span>

            <h2 className="gsap-about-el section-title text-foreground">
              Crafting Digital
              <br />
              <span className="text-gradient">Excellence</span>
            </h2>

            <div className="gsap-about-el space-y-4 text-muted-foreground leading-relaxed">
              <p>
                With over 3 years of experience in full-stack development, I specialize in building high-performance web applications that scale. My approach combines technical excellence with a deep understanding of user experience,
                backend architecture,
                and business objectives.
              </p>
              <p>
                I architect systems with clean,
                maintainable code at their core — focusing on performance optimization,
                security best practices, and scalable infrastructure. Every project I undertake is designed to be robust, future-proof,
                and easy to evolve as needs grow.
              </p>
              <p>
                From startups to complex SaaS and real-time applications, I've helped organizations transform their digital presence through elegant, reliable software solutions. My work spans frontend innovations with Next.js, backend systems in NestJS, AI/ML integration, and full-stack automation pipelines.
              </p>
            </div>

            <div className="gsap-about-el space-y-6 pt-4">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-foreground capitalize mb-3">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span key={skill} className="tech-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
