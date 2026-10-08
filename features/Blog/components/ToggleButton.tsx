import React from 'react';
import { cn } from '@/utils/cn';
import ActionButton, { type ActionButtonProps } from './ActionButton';

export interface ToggleButtonProps extends Omit<ActionButtonProps, 'variant' | 'iconOnly'> {
  selected: boolean;
}

/**
 * One option in a picker row (mono, uppercase): solid red when selected, bordered otherwise.
 * Announces its state with `aria-pressed`, so wrap a row of them in `role="group"` with a label.
 */
const ToggleButton: React.FC<ToggleButtonProps> = ({ selected, className, ...props }) => (
  <ActionButton
    variant={selected ? 'solid' : 'bordered'}
    aria-pressed={selected}
    className={cn('font-mono uppercase tracking-wider', className)}
    {...props}
  />
);

export default ToggleButton;
