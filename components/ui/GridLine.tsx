import React from 'react';

export interface GridLineProps {
  vertical?: boolean;
  className?: string;
}

const GridLine: React.FC<GridLineProps> = ({ vertical = false, className = "" }) => (
  <div 
    className={`absolute bg-neutral-800 ${vertical ? 'w-[1px] h-full top-0' : 'h-[1px] w-full left-0'} ${className}`}
  />
);

export default GridLine;
export { GridLine as GridLineComponent };
