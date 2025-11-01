'use client';

import { FC, useMemo } from 'react';

// シード付き乱数生成器（SSR/CSR 両方で同じ結果）
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
}

const generateStars = (count: number, seedBase: number = 12345): Star[] => {
  return Array.from({ length: count }, (_, i) => {
    const seed = seedBase + i;
    return {
      id: i,
      left: seededRandom(seed) * 100,
      top: seededRandom(seed + 1000) * 100,
      size: seededRandom(seed + 2000) * 2 + 1,
      duration: seededRandom(seed + 3000) * 3 + 2,
    };
  });
};

interface BackgroundProps {
  starCount?: number;
}

const Background: FC<BackgroundProps> = ({ starCount = 100 }) => {
  const stars = useMemo(() => generateStars(starCount), [starCount]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      {/* 惑星風のぼかし */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-30 blur-2xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-400 to-orange-500 opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-1/3 -right-20 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 opacity-25 blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
    </div>
  );
};

export default Background;