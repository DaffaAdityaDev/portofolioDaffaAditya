import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import { cn } from '@/utils/cn';
import AnimatedNumber from '@/features/Blog/components/AnimatedNumber';
import ActionButton from '@/features/Blog/components/ActionButton';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import type {
  ChangeRequest,
  ChangeRequestId,
  Codebase,
  FileEdit,
} from '@/features/Blog/posts/SolidPrinciples/widgets/changeRipple/types';
import { CHANGE_REQUESTS, CHANGE_REQUEST_ORDER, CODEBASES, CODEBASE_ORDER } from '../constants';

const formatCount = (value: number): string => Math.round(value).toString();

const FileCard: React.FC<{ path: string; role: string; edit?: FileEdit }> = ({ path, role, edit }) => (
  <li
    className={cn(
      'border px-3 py-2 transition-colors',
      !edit && 'border-neutral-800 text-neutral-500',
      edit?.kind === 'edited' && 'border-red-500/70 bg-red-500/10 text-neutral-100',
      edit?.kind === 'new' && 'border-dashed border-neutral-400 text-neutral-100',
    )}
  >
    <div className="flex items-center justify-between gap-2 font-mono text-xs">
      <span className="truncate">{path}</span>
      {edit && (
        <span
          className={cn(
            'shrink-0 px-1.5 py-px text-[10px] uppercase tracking-wider',
            edit.kind === 'edited' ? 'bg-red-500 text-white' : 'border border-neutral-400 text-neutral-300',
          )}
        >
          {edit.kind}
        </span>
      )}
    </div>
    <div className={cn('mt-0.5 text-[11px] leading-snug', edit ? 'text-neutral-400' : 'text-neutral-500')}>
      {edit ? edit.why : role}
    </div>
  </li>
);

const CodebaseColumn: React.FC<{ codebase: Codebase; change: ChangeRequest }> = ({ codebase, change }) => {
  const edits = change.edits[codebase.id];
  const editsByPath = new Map(edits.map((edit) => [edit.path, edit]));
  const newFiles = edits.filter((edit) => edit.kind === 'new');
  const editedCount = edits.length - newFiles.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="font-mono text-sm font-bold text-neutral-200">{codebase.label}</div>
          <div className="text-[11px] text-neutral-500">{codebase.caption}</div>
        </div>
        <div className="text-right">
          {/* Screen readers get the final count once, not every frame of the spring. */}
          <span className="sr-only" aria-live="polite">
            {`${editedCount} ${editedCount === 1 ? 'file' : 'files'} edited`}
            {newFiles.length > 0 && `, ${newFiles.length} new`}
          </span>
          <div aria-hidden="true">
            <div className={FLOW_METER_LABEL_CLASS}>files edited</div>
            <AnimatedNumber value={editedCount} format={formatCount} className="font-mono text-2xl text-red-500" />
            {newFiles.length > 0 && <span className="ml-1 font-mono text-xs text-neutral-400">+{newFiles.length} new</span>}
          </div>
        </div>
      </div>
      <ul className="flex flex-col gap-1.5">
        {codebase.files.map((file) => (
          <FileCard key={file.path} path={file.path} role={file.role} edit={editsByPath.get(file.path)} />
        ))}
        {newFiles.map((edit) => (
          <FileCard key={edit.path} path={edit.path} role={edit.why} edit={edit} />
        ))}
      </ul>
    </div>
  );
};

/**
 * One change request, applied to the same feature written 2 ways. Edited files
 * light up red, new files get a dashed outline, and the rest stay gray.
 */
const ChangeRipple: React.FC = () => {
  const [changeId, setChangeId] = useState<ChangeRequestId>(CHANGE_REQUEST_ORDER[0]);
  const change = CHANGE_REQUESTS[changeId];

  return (
    <WidgetFrame title="How far a change spreads" icon={GitBranch}>
      <div className="flex flex-col gap-4 p-4">
        <div className="-mx-4 overflow-x-auto px-4">
          <div className="flex w-max gap-2" role="group" aria-label="Change request">
            {CHANGE_REQUEST_ORDER.map((id) => {
              const isSelected = id === changeId;
              return (
                <ActionButton
                  key={id}
                  variant={isSelected ? 'solid' : 'bordered'}
                  aria-pressed={isSelected}
                  onClick={() => setChangeId(id)}
                  className="font-mono text-xs"
                >
                  <span className="font-bold">{CHANGE_REQUESTS[id].letters.join(' ')}</span>
                  <span>{CHANGE_REQUESTS[id].label}</span>
                </ActionButton>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {CODEBASE_ORDER.map((id) => (
            <CodebaseColumn key={id} codebase={CODEBASES[id]} change={change} />
          ))}
        </div>

        <p className="border-t border-neutral-800 pt-3 text-xs leading-relaxed text-neutral-400">{change.lesson}</p>
      </div>
    </WidgetFrame>
  );
};

export default ChangeRipple;
