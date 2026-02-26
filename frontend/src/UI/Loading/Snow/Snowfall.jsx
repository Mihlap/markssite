import { useEffect, useRef } from 'react';

const Snowfall = ({ children }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const flakesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;

    const random = Math.random;

    class Snowflake {
      constructor() {
        this.size = random() * 2 + 2;
        this.xBase = random() * width;
        this.x = this.xBase;
        this.y = random() * height;
        this.swing = random() * 50 + 1;
        this.opacity = random();
        this.phase = random() * Math.PI * 2;
        this.speed = random() * 1.5 + 0.5;
      }

      update() {
        this.y += this.speed;
        if (this.y > height + this.size) {
          this.y = -this.size;
        }

        this.phase += 0.02;
        this.x = this.xBase + this.swing * Math.sin(this.phase);

        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      canvas.width = width;
      canvas.height = height;

      const count = Math.ceil((width * height) / 15000);
      flakesRef.current = Array.from({ length: count }, () => new Snowflake());
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      flakesRef.current.forEach((flake) => flake.update());
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}>
      {children}

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 999,
        }}
      />
    </div>
  );
};

export default Snowfall;
