import React from "react";

/**
 * Spinner — a 12-blade fading loader, styled with Tailwind.
 *
 * Props:
 *  - color: any Tailwind bg-* class or a CSS color string (default: "#1a1a8c")
 *  - size:  overall diameter in px (default: 40)
 */
export default function Spinner({ color = "#1a1a8c", size = 40 }) {
  const blades = Array.from({ length: 8 });
  const bladeWidth = Math.max(2, size * 0.1);
  const bladeHeight = size * 0.28;

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {blades.map((_, i) => {
        const rotation = i * 45;
        const delay = -(1 - i / 12).toFixed(3);
        return (
          <div
            key={i}
            className="absolute top-0 left-1/2 rounded-full animate-spinner-fade"
            style={{
              width: bladeWidth,
              height: bladeHeight,
              marginLeft: -bladeWidth / 2,
              backgroundColor: color,
              transformOrigin: `${bladeWidth / 2}px ${size / 2}px`,
              transform: `rotate(${rotation}deg)`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes spinner-fade {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
        .animate-spinner-fade {
          animation: spinner-fade 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
