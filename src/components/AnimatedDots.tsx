'use client';
import { useState, useEffect } from 'react';

export default function AnimatedDots() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setCount(c => (c % 3) + 1), 400);
    return () => clearInterval(id);
  }, []);
  // 用全形句點，視覺比英文點更明顯
  return <span style={{ letterSpacing: 2 }}>{'．'.repeat(count)}<span style={{ opacity: 0 }}>{'．'.repeat(3 - count)}</span></span>;
}
