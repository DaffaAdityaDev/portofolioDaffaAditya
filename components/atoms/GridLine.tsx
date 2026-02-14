import React from 'react';

const GridLine = ({ vertical = false, className = "" }: { vertical?: boolean; className?: string }) => (
  <div 
    className={`absolute bg-neutral-800 ${vertical ? 'w-[1px] h-full top-0' : 'h-[1px] w-full left-0'} ${className}`}
  ></div>
);

export default GridLine;
