const CONFETTI_PIECES = [
  { left: 4, delay: 0.1, duration: 3.8, color: "#6c3aff", rotate: 18 },
  { left: 6, delay: 1.35, duration: 4.9, color: "#facc15", rotate: 121 },
  { left: 9, delay: 0.6, duration: 4.2, color: "#f97316", rotate: 72 },
  { left: 14, delay: 0.2, duration: 3.4, color: "#14b8a6", rotate: 28 },
  { left: 16, delay: 1.6, duration: 5.2, color: "#ffffff", rotate: 155 },
  { left: 19, delay: 0.9, duration: 4.6, color: "#22c55e", rotate: 91 },
  { left: 25, delay: 0.4, duration: 3.9, color: "#eab308", rotate: 34 },
  { left: 28, delay: 1.45, duration: 4.7, color: "#fb7185", rotate: 132 },
  { left: 31, delay: 1.1, duration: 4.4, color: "#ec4899", rotate: 67 },
  { left: 38, delay: 0.3, duration: 3.7, color: "#3b82f6", rotate: 16 },
  { left: 41, delay: 1.75, duration: 5.1, color: "#2dd4bf", rotate: 148 },
  { left: 44, delay: 0.8, duration: 4.8, color: "#a855f7", rotate: 80 },
  { left: 51, delay: 0.15, duration: 3.6, color: "#ef4444", rotate: 42 },
  { left: 54, delay: 1.55, duration: 4.6, color: "#fef08a", rotate: 176 },
  { left: 58, delay: 0.7, duration: 4.1, color: "#06b6d4", rotate: 64 },
  { left: 64, delay: 1.25, duration: 4.9, color: "#84cc16", rotate: 12 },
  { left: 67, delay: 0.95, duration: 3.9, color: "#c084fc", rotate: 111 },
  { left: 71, delay: 0.5, duration: 3.5, color: "#f59e0b", rotate: 53 },
  { left: 78, delay: 0.05, duration: 4.3, color: "#8b5cf6", rotate: 37 },
  { left: 81, delay: 1.5, duration: 5, color: "#34d399", rotate: 137 },
  { left: 84, delay: 1, duration: 4.7, color: "#10b981", rotate: 76 },
  { left: 91, delay: 0.35, duration: 3.8, color: "#f43f5e", rotate: 21 },
  { left: 94, delay: 1.3, duration: 4.2, color: "#fde68a", rotate: 107 },
  { left: 96, delay: 0.75, duration: 4.5, color: "#0ea5e9", rotate: 88 },
];

const STREAMERS = [
  { left: 12, delay: 0.15, color: "#f97316", width: 78 },
  { left: 33, delay: 0.45, color: "#6c3aff", width: 96 },
  { left: 52, delay: 0.25, color: "#14b8a6", width: 86 },
  { left: 73, delay: 0.65, color: "#ec4899", width: 92 },
  { left: 88, delay: 0.35, color: "#facc15", width: 72 },
];

export function CelebrationConfetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <style>
        {`
          @keyframes achievement-confetti-fall {
            0% {
              transform: translate3d(0, -12vh, 0) rotate(0deg);
              opacity: 0;
            }
            8% {
              opacity: 1;
            }
            82% {
              opacity: 1;
            }
            100% {
              transform: translate3d(var(--drift), 112vh, 0) rotate(var(--spin));
              opacity: 0;
            }
          }
          @keyframes achievement-streamer-drop {
            0% {
              transform: translate3d(0, -16vh, 0) rotate(-28deg) scaleX(.4);
              opacity: 0;
            }
            12% {
              opacity: .95;
            }
            100% {
              transform: translate3d(var(--drift), 118vh, 0) rotate(420deg) scaleX(1);
              opacity: 0;
            }
          }
        `}
      </style>
      {STREAMERS.map((streamer) => (
        <span
          key={`${streamer.left}-${streamer.color}`}
          className="absolute top-0 block h-2 rounded-full"
          style={
            {
              left: `${streamer.left}%`,
              width: `${streamer.width}px`,
              backgroundColor: streamer.color,
              animation: `achievement-streamer-drop 5.2s cubic-bezier(.16,.84,.31,1) ${streamer.delay}s both`,
              "--drift": `${streamer.left % 2 === 0 ? -120 : 120}px`,
            } as React.CSSProperties
          }
        />
      ))}
      {CONFETTI_PIECES.map((piece) => (
        <span
          key={`${piece.left}-${piece.color}`}
          className="absolute top-0 block h-3 w-2 rounded-[2px]"
          style={
            {
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animation: `achievement-confetti-fall ${piece.duration}s ease-out ${piece.delay}s both`,
              "--drift": `${piece.rotate % 2 === 0 ? 40 : -40}px`,
              "--spin": `${piece.rotate * 8}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
