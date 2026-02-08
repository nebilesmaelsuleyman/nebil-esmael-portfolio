import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import developerPhoto from '@/assets/developer-photo.jpg';

const skills = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  backend: ['Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'Authentication'],
  database: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma'],
  tools: ['Git', 'GitHub', 'Docker', 'CI/CD', 'AWS', 'Vercel'],
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

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="min-h-screen py-24 lg:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Photo */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
              {/* Image frame */}
              <div className="absolute inset-0 border border-primary/30 rounded-lg -translate-x-4 -translate-y-4" />
              
              {/* Main image */}
              <div className="relative h-full rounded-lg overflow-hidden glass-card">
                <img
                  src={developerPhoto}
                  alt="Alex Mitchell - Full-Stack Developer"
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border border-accent/30 rounded-lg" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            {/* Section label */}
            <motion.span variants={itemVariants} className="text-primary text-sm font-medium tracking-wider uppercase">
              About Me
            </motion.span>

            {/* Title */}
            <motion.h2 variants={itemVariants} className="section-title text-foreground">
              Crafting Digital
              <br />
              <span className="text-gradient">Excellence</span>
            </motion.h2>

            {/* Bio */}
            <motion.div variants={itemVariants} className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                With over 8 years of experience in full-stack development, I specialize in building 
                high-performance web applications that scale. My approach combines technical excellence 
                with a deep understanding of user experience and business objectives.
              </p>
              <p>
                I architect systems with clean, maintainable code at their core — focusing on 
                performance optimization, security best practices, and scalable infrastructure. 
                Every project I undertake is built to last and designed to grow.
              </p>
              <p>
                From startups to enterprise solutions, I've helped organizations transform their 
                digital presence through robust, elegant software solutions.
              </p>
            </motion.div>

            {/* Skills Grid */}
            <motion.div variants={itemVariants} className="space-y-6 pt-4">
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
