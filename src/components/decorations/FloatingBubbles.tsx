import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const codingWords = [
  'git push 🚀', '// TODO: fix later', 'npm install', 'console.log("why?")',
  'Linux', 'sudo rm -rf /', '!important', 'woohoo it works', 'Nextjs',
  'ChatGpt', 'it works on my machine', ';', 'async/await ⏳', 'Tailwind',
  ' 404', '200 success', 'Hello World', 'React', 'i wil finish later', 'nestjs',
  '//FIXME', '¯\\_(ツ)_/¯', 'works™', 'yarn why', 'npm install exelence',
  'ExpressJs', 'refactor later', 'ship it! 🚢', 'bug → feature',
];

export const FloatingBubbles = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const bubbles = containerRef.current.querySelectorAll('.code-bubble');
    const tweens: gsap.core.Tween[] = [];

    bubbles.forEach((bubble) => {
      const delay = Math.random() * 3;
      const duration = 8 + Math.random() * 12;
      const xRange = 30 + Math.random() * 60;

      // Start visible immediately
      gsap.set(bubble, {
        opacity: 0.15 + Math.random() * 0.15,
        x: Math.random() * 100 - 50,
        y: Math.random() * 40 - 20,
      });

      tweens.push(
        gsap.to(bubble, {
          y: `-=${20 + Math.random() * 30}`,
          x: `+=${Math.random() > 0.5 ? xRange : -xRange}`,
          duration,
          delay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }),
        gsap.to(bubble, {
          opacity: 0.25 + Math.random() * 0.25,
          duration: 3 + Math.random() * 4,
          delay: delay + 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      );
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {codingWords.map((word, i) => (
        <div
          key={i}
          className="code-bubble absolute text-primary text-xs font-mono select-none"
          style={{
            top: `${8 + (i * 3.2) % 85}%`,
            left: `${5 + (i * 7.3) % 90}%`,
          }}
        >
          {word}
        </div>
      ))}
    </div>
  );
};
