import React from 'react';

const words = [
  'build', 'break', 'repeat', 'curiosity', 'system', 'experiment', 'iterate',
  'build', 'break', 'repeat', 'curiosity', 'system', 'experiment', 'iterate',
  'build', 'break', 'repeat', 'curiosity', 'system', 'experiment', 'iterate'
];

// Generate random positions statically so they don't jump on re-render
const scatteredWords = words.map((word, i) => ({
  id: i,
  word,
  top: `${Math.random() * 150 - 25}%`,
  left: `${Math.random() * 120 - 10}%`,
  rotation: Math.random() * 60 - 30,
  scale: Math.random() * 1.5 + 1.5, // Large words
}));

const BackgroundWords: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0, // Behind everything
        overflow: 'hidden',
        mixBlendMode: 'multiply',
      }}
    >
      {scatteredWords.map((item) => (
        <span
          key={item.id}
          className="font-accent"
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
            fontSize: '120px',
            fontWeight: 700, // Amatic SC 700 is max, simulate 900 with it
            color: 'var(--geo-black)',
            opacity: 0.03, // Barely visible paper texture
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {item.word}
        </span>
      ))}
    </div>
  );
};

export default BackgroundWords;
