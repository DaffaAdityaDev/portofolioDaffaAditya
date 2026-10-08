import React, { useCallback, useId, useState } from 'react';
import { RotateCcw, SquareTerminal } from 'lucide-react';
import type { ReactPlaygroundProps } from '@/types/blog';
import { PLAYGROUND_DEFAULT_HEIGHT, PLAYGROUND_ENTRY_FILES } from '../../constants';
import { usePlaygroundPreview } from '../../hooks/usePlaygroundPreview';
import { buildPlaygroundFiles, toPlaygroundPath } from '../../utils/playground';
import ToolbarButton from '../ToolbarButton';
import PlaygroundConsole from './PlaygroundConsole';
import PlaygroundEditor from './PlaygroundEditor';
import PlaygroundFileTabs, { tabId } from './PlaygroundFileTabs';
import PlaygroundPreview from './PlaygroundPreview';

interface PlaygroundToolbarProps {
  title?: string;
  showConsole: boolean;
  isConsoleOpen: boolean;
  onToggleConsole: () => void;
  onReset: () => void;
}

const PlaygroundToolbar: React.FC<PlaygroundToolbarProps> = ({
  title,
  showConsole,
  isConsoleOpen,
  onToggleConsole,
  onReset,
}) => (
  <div className="flex h-8 items-center justify-between border border-b-0 border-neutral-800 bg-neutral-900/50 pl-3 pr-1 font-mono text-xs">
    <div className="flex min-w-0 items-center gap-2 text-neutral-400">
      <span className="relative flex size-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-red-500" />
      </span>
      <span className="truncate">{title ?? 'Live React'}</span>
      {title && (
        <span className="hidden shrink-0 border border-neutral-800 px-1.5 py-px text-[10px] uppercase tracking-wider text-neutral-400 sm:inline">
          Live React
        </span>
      )}
    </div>
    <div className="flex shrink-0 items-center">
      {showConsole && (
        <ToolbarButton
          label={isConsoleOpen ? 'Hide console' : 'Show console'}
          pressed={isConsoleOpen}
          onClick={onToggleConsole}
        >
          <SquareTerminal className="size-3.5" aria-hidden="true" />
          <span>Console</span>
        </ToolbarButton>
      )}
      <ToolbarButton label="Reset code" onClick={onReset}>
        <RotateCcw className="size-3.5" aria-hidden="true" />
        <span>Reset</span>
      </ToolbarButton>
    </div>
  </div>
);

interface PlaygroundBodyProps {
  initialFiles: Record<string, string>;
  entryFile: string;
  initialPath: string;
  title?: string;
  height: number;
  showConsole: boolean;
}

const PlaygroundBody: React.FC<PlaygroundBodyProps> = ({
  initialFiles,
  entryFile,
  initialPath,
  title,
  height,
  showConsole,
}) => {
  const [files, setFiles] = useState(initialFiles);
  const [activePath, setActivePath] = useState(initialPath);
  // A post that asks for a console wants it read, so it starts open.
  const [isConsoleOpen, setIsConsoleOpen] = useState(showConsole);
  const preview = usePlaygroundPreview(files, entryFile);
  const panelId = useId();

  const paths = Object.keys(files);

  const updateFile = useCallback(
    (code: string) => setFiles((current) => ({ ...current, [activePath]: code })),
    [activePath],
  );

  const reset = () => {
    setFiles(initialFiles);
    preview.reload();
  };

  return (
    <div className="react-playground">
      <PlaygroundToolbar
        title={title}
        showConsole={showConsole}
        isConsoleOpen={isConsoleOpen}
        onToggleConsole={() => setIsConsoleOpen((value) => !value)}
        onReset={reset}
      />
      {/* Side by side from md up, stacked below it. */}
      <div className="grid border border-neutral-800 md:grid-cols-2">
        <div className="flex min-w-0 flex-col border-neutral-800 max-md:border-b md:border-r" style={{ height }}>
          <PlaygroundFileTabs paths={paths} activePath={activePath} onSelect={setActivePath} panelId={panelId} />
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId(panelId, paths.indexOf(activePath))}
            className="min-h-0 flex-1"
          >
            <PlaygroundEditor
              key={activePath}
              path={activePath}
              value={files[activePath]}
              onChange={updateFile}
            />
          </div>
        </div>
        <div className="min-w-0">
          <PlaygroundPreview
            iframeRef={preview.iframeRef}
            frameKey={preview.frameKey}
            status={preview.status}
            hasLoaded={preview.hasLoaded}
            needsPageReload={preview.needsPageReload}
            height={height}
            onReload={preview.reload}
            onReset={reset}
          />
        </div>
      </div>
      {showConsole && isConsoleOpen && (
        <PlaygroundConsole entries={preview.entries} onClear={preview.clearConsole} />
      )}
    </div>
  );
};

/**
 * Editor, preview and console. Edits recompile after a short pause and run in a
 * sandboxed iframe served by this site, so nothing depends on an outside service.
 */
const Playground: React.FC<ReactPlaygroundProps> = ({
  children,
  files,
  title,
  template = 'react',
  height = PLAYGROUND_DEFAULT_HEIGHT,
  showConsole = false,
  activeFile,
}) => {
  const entryFile = PLAYGROUND_ENTRY_FILES[template];
  const initialFiles = buildPlaygroundFiles({ files, children }, entryFile);
  const paths = Object.keys(initialFiles);

  if (paths.length === 0) {
    return (
      <div className="border border-neutral-800 p-4 font-mono text-xs text-neutral-500" role="alert">
        ReactPlayground needs code: pass a string as children, or a files object.
      </div>
    );
  }

  const preferred = activeFile ? toPlaygroundPath(activeFile) : entryFile;
  const initialPath = preferred in initialFiles ? preferred : initialFiles[entryFile] !== undefined ? entryFile : paths[0];

  return (
    <PlaygroundBody
      initialFiles={initialFiles}
      entryFile={entryFile}
      initialPath={initialPath}
      title={title}
      height={height}
      showConsole={showConsole}
    />
  );
};

export default Playground;
