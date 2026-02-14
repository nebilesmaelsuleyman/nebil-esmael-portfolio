import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';

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

    const initAnimation = () => {
      const totalWidth = row.scrollWidth / 2;
      if (totalWidth <= 0 || isNaN(totalWidth)) return;

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
    };

    const timeout = setTimeout(initAnimation, 500);
    window.addEventListener('load', initAnimation);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('load', initAnimation);
    };
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const TechStackSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="tech-stack" className="py-24 lg:py-32 relative overflow-hidden flex flex-col justify-center min-h-[70vh]">
      {/* Background accents - Exactly matching ContactSection style */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 mb-12">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center space-y-4"
        >
          <motion.span variants={itemVariants} className="text-primary text-sm font-medium tracking-wider uppercase block font-display">
            Tech Arsenal
          </motion.span>
          <motion.h2 variants={itemVariants} className="section-title text-foreground">
            Technologies I <span className="text-gradient">Master</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="section-subtitle max-w-2xl mx-auto text-lg text-muted-foreground">
            The tools and frameworks I use to bring ideas to life — battle-tested in production.
          </motion.p>
        </motion.div>
      </div>

      {/* Infinite scrolling rows */}
      <div className="relative z-20 space-y-4">
        <LogoRow direction="left" speed={60} />
        <LogoRow direction="right" speed={50} />
      </div>
    </section>
  );
};

