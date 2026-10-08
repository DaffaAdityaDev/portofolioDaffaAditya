import React from 'react';

export interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** On/off switch (`role="switch"`) with the blog's mono label. Space or Enter toggles it. */
const SwitchField: React.FC<SwitchFieldProps> = ({ label, checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="group inline-flex max-w-fit cursor-pointer select-none items-center outline-none"
  >
    <span
      aria-hidden="true"
      className="inline-flex h-6 w-10 shrink-0 items-center rounded-full bg-[#3f3f46] px-1 transition-colors group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-red-500 group-aria-checked:bg-[#f31260] motion-reduce:transition-none"
    >
      <span className="size-4 rounded-full bg-white shadow-sm transition-all group-aria-checked:ms-4 motion-reduce:transition-none" />
    </span>
    <span className="ms-2 font-mono text-xs uppercase tracking-wider text-neutral-300">{label}</span>
  </button>
);

export default SwitchField;
