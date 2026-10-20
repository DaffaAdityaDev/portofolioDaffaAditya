import React from 'react';
import { cn } from '@/utils/cn';
import type { PartState, PprResponse } from '../types';
import { partState } from '../utils/model';

/** Box classes for each state: grey when done, red dashed while its hole waits for data. */
const PART_CLASS: Record<PartState, string> = {
  blank: 'border-transparent bg-transparent',
  skeleton: 'animate-pulse border-dashed border-red-500/70 bg-neutral-900',
  ready: 'border-border-strong bg-neutral-800',
  generic: 'border-border bg-neutral-900 opacity-60',
};

const Part: React.FC<{ state: PartState; className?: string; children?: React.ReactNode }> = ({
  state,
  className,
  children,
}) => (
  <div className={cn('border transition-colors duration-300', PART_CLASS[state], className)}>
    {state === 'blank' ? null : children}
  </div>
);

interface StorePreviewProps {
  response: PprResponse;
  clockMs: number | null;
}

/** A phone-sized store page: header, cart pill, banner and product grid. */
const StorePreview: React.FC<StorePreviewProps> = ({ response, clockMs }) => {
  const shell = partState(response.shell, response.shell, clockMs);
  const cart = partState(response.cart, response.shell, clockMs);
  const products = partState(response.products, response.shell, clockMs);

  return (
    <div
      className="relative mx-auto flex h-[300px] w-full max-w-[220px] flex-col gap-2 rounded-lg border border-border bg-background p-2"
      role="img"
      aria-label={`Store page preview: page ${shell}, cart ${cart}, products ${products}`}
    >
      {shell === 'blank' && (
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center font-mono text-2xs uppercase tracking-wider text-muted-foreground">
          Blank screen: waiting for the first byte
        </div>
      )}

      <Part state={shell} className="flex items-center justify-between px-2 py-1.5">
        <span className="font-mono text-2xs text-neutral-300">My Store</span>
        <Part state={cart} className="min-w-[64px] px-2 py-0.5 text-center font-mono text-[9px] text-neutral-200">
          {cart === 'ready' && 'Cart: 3 items'}
          {cart === 'generic' && 'Cart'}
          {cart === 'skeleton' && <span className="text-red-400">loading</span>}
        </Part>
      </Part>
      {cart === 'generic' && (
        <div className="-mt-1 text-right font-mono text-[9px] uppercase text-muted-foreground">same for every user</div>
      )}

      <Part state={shell} className="h-14" />

      <div className="grid flex-1 grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((index) => (
          <Part key={index} state={products} />
        ))}
      </div>
      {products === 'generic' && (
        <div className="text-center font-mono text-[9px] uppercase text-muted-foreground">built at deploy time</div>
      )}
    </div>
  );
};

export default StorePreview;
