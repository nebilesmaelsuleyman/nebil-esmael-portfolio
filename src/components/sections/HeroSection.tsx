import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const HeroSection = () => {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1115]">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-[45%] flex flex-col items-start"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Available for Job
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl lg:text-[80px] font-display font-bold text-white mb-4 leading-tight tracking-tight">
            Nebil Esmael
          </motion.h1>

          {/* Title */}
          <motion.p variants={itemVariants} className="text-2xl md:text-3xl text-primary font-medium mb-6">
            Full-Stack Developer
          </motion.p>

          {/* Headline */}
          <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
            I architect and build high-performance web applications with a focus on
            <span className="text-gray-200 font-medium"> clean code</span>,
            <span className="text-gray-200 font-medium"> scalable systems</span>, and
            <span className="text-gray-200 font-medium"> exceptional user experiences</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-14">
            <motion.button
              onClick={scrollToProjects}
              className="px-8 py-3.5 rounded-lg text-white font-medium shadow-[0_0_20px_rgba(46,204,113,0.3)] hover:shadow-[0_0_30px_rgba(46,204,113,0.5)] transition-all duration-300"
              style={{
                background: 'linear-gradient(90deg, #2ecc71, #27ae60)',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              View Projects
            </motion.button>
            <motion.button
              onClick={scrollToContact}
              className="px-8 py-3.5 rounded-lg text-gray-300 font-medium border border-gray-700 bg-[#1A2228]/50 hover:bg-[#1A2228] hover:text-white transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Me
            </motion.button>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex items-center gap-6">
            <a
              href="https://github.com/nebilesmaelsuleyman"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[#1A2228] text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/nebil-esmael-85846b2b8/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[#1A2228] text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:nebilesmaelsuleyman@gmail.com"
              className="p-2.5 rounded-full bg-[#1A2228] text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
            >
              <Mail size={20} />
            </a>
          </motion.div>
        </motion.div>

        {/* iMac Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.6, duration: 1, type: "spring", stiffness: 50 }}
          className="w-full lg:w-[55%] flex justify-center relative perspective-1000"
        >
          <div className="relative w-full max-w-[650px]" style={{ transformStyle: 'preserve-3d' }}>
            {/* Monitor Bezel */}
            <div className="relative z-10 w-full aspect-[16/10] bg-[#1a1a1a] rounded-xl sm:rounded-3xl border-2 border-[#333] p-3 sm:p-5 shadow-2xl flex flex-col">
              {/* Screen Content */}
              <div className="flex-1 bg-[#1E1E1E] w-full h-full overflow-hidden flex flex-col font-mono text-xs sm:text-sm shadow-inner rounded-sm sm:rounded-lg">
                {/* Editor Header */}
                <div className="flex items-center px-4 py-2 bg-[#2D2D2D] gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  <span className="ml-2 text-gray-400 text-xs">app.ts</span>
                </div>
                {/* Code Body */}
                <div className="p-4 sm:p-6 text-left leading-relaxed text-gray-300 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1E1E1E]/80 pointer-events-none z-10 bottom-0 h-full" style={{ background: 'linear-gradient(180deg, transparent 70%, #1E1E1E 100%)'}} />
                  <div className="flex gap-2">
                    <span className="text-[#569CD6]">const</span>
                    <span className="text-[#4FC1FF]">app</span>
                    <span className="text-[#D4D4D4]">=</span>
                    <span className="text-[#DCDCAA]">express</span>
                    <span className="text-[#D4D4D4]">();</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[#569CD6]">async function</span>
                    <span className="text-[#DCDCAA]">deploy</span>
                    <span className="text-[#D4D4D4]">() {"{"}</span>
                  </div>
                  <div className="flex gap-2 pl-4">
                    <span className="text-[#569CD6]">const</span>
                    <span className="text-[#4FC1FF]">res</span>
                    <span className="text-[#D4D4D4]">=</span>
                    <span className="text-[#C586C0]">await</span>
                    <span className="text-[#4FC1FF]">api</span>
                    <span className="text-[#D4D4D4]">.</span>
                    <span className="text-[#DCDCAA]">call</span>
                    <span className="text-[#D4D4D4]">();</span>
                  </div>
                  <div className="flex gap-2 pl-4">
                    <span className="text-[#C586C0]">if</span>
                    <span className="text-[#D4D4D4]">(res.</span>
                    <span className="text-[#4FC1FF]">ok</span>
                    <span className="text-[#D4D4D4]">) {"{"}</span>
                  </div>
                  <div className="flex gap-2 pl-8">
                    <span className="text-[#4FC1FF]">console</span>
                    <span className="text-[#D4D4D4]">.</span>
                    <span className="text-[#DCDCAA]">log</span>
                    <span className="text-[#D4D4D4]">(</span>
                    <span className="text-[#CE9178]">"Success!"</span>
                    <span className="text-[#D4D4D4]">);</span>
                  </div>
                  <div className="flex gap-2 pl-4 text-[#D4D4D4]">{"}"}</div>
                  <div className="flex gap-2 text-[#D4D4D4]">{"}"}</div>
                  <div className="flex gap-2 mt-4 text-[#6A9955] italic">
                    // Professional Development
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#C586C0]">export default</span>
                    <span className="text-[#4EC9B0]">Portfolio</span>
                    <span className="text-[#D4D4D4]">;</span>
                  </div>
                  <div className="flex gap-2 mt-4 text-[#6A9955] italic">
                    // Ready to build the future.
                  </div>
                </div>
              </div>
              
              {/* iMac Chin Logo Area */}
              <div className="h-6 sm:h-10 w-full flex items-center justify-center mt-2 sm:mt-0 relative z-10">
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-500/50" />
              </div>
            </div>
            
            {/* Stand */}
            <div className="relative z-0 mx-auto w-1/4 h-16 sm:h-24 bg-gradient-to-b from-[#333] to-[#1a1a1a] shadow-xl" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', marginTop: '-4px' }}></div>
            {/* Base */}
            <div className="mx-auto w-2/3 h-3 sm:h-4 bg-[#222] rounded-t-xl shadow-2xl relative z-10 border-t border-[#444]"></div>
            
            {/* Star decoration */}
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -right-8 -bottom-10 text-gray-700 opacity-50"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L3 11l8.5-2.5z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
      >
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
};

