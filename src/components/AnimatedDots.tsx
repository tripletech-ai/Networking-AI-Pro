'use client';

export default function AnimatedDots() {
  return (
    <>
      <style>{`
        @keyframes _dot-fade {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        ._dot { display: inline-block; animation: _dot-fade 1.2s ease-in-out infinite; }
        ._dot:nth-child(2) { animation-delay: 0.4s; }
        ._dot:nth-child(3) { animation-delay: 0.8s; }
      `}</style>
      <span aria-hidden="true" style={{ letterSpacing: 1 }}>
        <span className="_dot">．</span>
        <span className="_dot">．</span>
        <span className="_dot">．</span>
      </span>
    </>
  );
}
