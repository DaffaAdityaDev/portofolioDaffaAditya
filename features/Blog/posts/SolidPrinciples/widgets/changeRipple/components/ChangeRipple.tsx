import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import { cn } from '@/utils/cn';
import AnimatedNumber from '@/features/Blog/components/AnimatedNumber';
import ToggleButton from '@/features/Blog/components/ToggleButton';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import { WIDGET_LABEL_CLASS } from '@/features/Blog/components/widgetStyles';
import type {
  ChangeRequest,
  ChangeRequestId,
  Codebase,
  FileEdit,
} from '../types';
import { CHANGE_REQUESTS, CHANGE_REQUEST_ORDER, CODEBASES, CODEBASE_ORDER } from '../constants';

const formatCount = (value: number): string => Math.round(value).toString();

const FileCard: React.FC<{ path: string; role: string; edit?: FileEdit }> = ({ path, role, edit }) => (
  <li
    className={cn(
      'rounded-lg border px-3 py-2 transition-colors',
      !edit && 'border-border text-neutral-500',
      edit?.kind === 'edited' && 'border-red-500/70 bg-red-500/10 text-neutral-100',
      edit?.kind === 'new' && 'border-dashed border-neutral-400 text-neutral-100',
    )}
  >
    <div className="flex items-center justify-between gap-2 font-mono text-xs">
      <span className="truncate">{path}</span>
      {edit && (
        <span
          className={cn(
            'shrink-0 rounded-lg px-1.5 py-px text-2xs uppercase tracking-wider',
            edit.kind === 'edited' ? 'bg-red-500 text-white' : 'border border-neutral-400 text-neutral-300',
          )}
        >
          {edit.kind}
        </span>
      )}
    </div>
    <div className={cn('mt-0.5 text-2xs leading-snug', edit ? 'text-muted-foreground' : 'text-neutral-500')}>
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
          <div className="text-2xs text-neutral-500">{codebase.caption}</div>
        </div>
        <div className="text-right">
          {/* Screen readers get the final count once, not every frame of the spring. */}
          <span className="sr-only" aria-live="polite">
            {`${editedCount} ${editedCount === 1 ? 'file' : 'files'} edited`}
            {newFiles.length > 0 && `, ${newFiles.length} new`}
          </span>
          <div aria-hidden="true">
            <div className={WIDGET_LABEL_CLASS}>files edited</div>
            <AnimatedNumber value={editedCount} format={formatCount} className="font-mono text-2xl text-red-500" />
            {newFiles.length > 0 && <span className="ml-1 font-mono text-xs text-muted-foreground">+{newFiles.length} new</span>}
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
            {CHANGE_REQUEST_ORDER.map((id) => (
              <ToggleButton
                key={id}
                selected={id === changeId}
                onClick={() => setChangeId(id)}
                // The labels are sentences, so keep their own casing.
                className="normal-case tracking-normal"
              >
                <span className="font-bold">{CHANGE_REQUESTS[id].letters.join(' ')}</span>
                <span>{CHANGE_REQUESTS[id].label}</span>
              </ToggleButton>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {CODEBASE_ORDER.map((id) => (
            <CodebaseColumn key={id} codebase={CODEBASES[id]} change={change} />
          ))}
        </div>

        <p className="border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">{change.lesson}</p>
      </div>
    </WidgetFrame>
  );
};

export default ChangeRipple;
