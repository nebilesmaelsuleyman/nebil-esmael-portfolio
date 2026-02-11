import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg' },
  { name: "Mongoose", icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' }
];

const LogoRow = ({ direction, speed }: { direction: 'left' | 'right'; speed: number }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rowRef.current) return;
    const row = rowRef.current;
    const totalWidth = row.scrollWidth / 2;

    gsap.to(row, {
      x: direction === 'left' ? -totalWidth : totalWidth,
      duration: speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          const val = parseFloat(String(x));
          if (direction === 'left') {
            return val % totalWidth;
          }
          return (val % totalWidth) - totalWidth;
        }),
      },
    });
  }, [direction, speed]);

  const items = [...techStack, ...techStack];

  return (
    <div className="overflow-hidden py-4">
      <div ref={rowRef} className="flex gap-8 w-max">
        {items.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="flex items-center gap-3 px-6 py-3 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group"
          >
            <img
              src={tech.icon}
              alt={tech.name}
              className="w-7 h-7 object-contain group-hover:scale-110 transition-transform duration-300 dark:invert-[0.15]"
              loading="lazy"
            />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TechStackSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.gsap-tech-el');

    gsap.fromTo(
      els,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 mb-12">
        <div className="text-center space-y-4">
          <span className="gsap-tech-el text-primary text-sm font-medium tracking-wider uppercase block">
            Tech Arsenal
          </span>
          <h2 className="gsap-tech-el section-title text-foreground">
            Technologies I <span className="text-gradient">Master</span>
          </h2>
          <p className="gsap-tech-el section-subtitle max-w-2xl mx-auto">
            The tools and frameworks I use to bring ideas to life — battle-tested in production.
          </p>
        </div>
      </div>

      {/* Infinite scrolling rows */}
      <div className="space-y-2">
        <LogoRow direction="left" speed={40} />
        <LogoRow direction="right" speed={35} />
      </div>
    </section>
  );
};
