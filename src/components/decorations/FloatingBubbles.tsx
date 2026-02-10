import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const codingWords = [
  'git push 🚀', '// TODO: fix later', 'npm install', 'console.log("why?")',
  'undefined is not a function', 'sudo rm -rf /', '!important', 'merge conflict 😱',
  'Stack Overflow', 'it works on my machine', ';', 'async/await ⏳',
  '404', 'Hello World', 'null pointer', 'chmod 777', 'const > let',
  '//FIXME', '¯\\_(ツ)_/¯', 'works™', 'yarn why', 'git blame',
  '<div> soup', 'refactor later', 'ship it! 🚢', 'bug → feature',
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
        opacity: 0.08 + Math.random() * 0.12,
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
          opacity: 0.15 + Math.random() * 0.2,
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
          className="code-bubble absolute text-primary/30 text-xs font-mono select-none"
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
