import React from 'react';

const Marquee = ({ text, direction = 'left' }: { text: string; direction?: 'left' | 'right' }) => (
  <div className="overflow-hidden whitespace-nowrap bg-white text-black py-2 border-y border-black">
    <div className={`inline-block animate-${direction === 'left' ? 'marquee' : 'marquee-reverse'}`}>
      <span className="text-xl font-bold font-mono tracking-tighter mx-4">{text}</span>
      <span className="text-xl font-bold font-mono tracking-tighter mx-4">{text}</span>
      <span className="text-xl font-bold font-mono tracking-tighter mx-4">{text}</span>
      <span className="text-xl font-bold font-mono tracking-tighter mx-4">{text}</span>
    </div>
  </div>
);

export default Marquee;
