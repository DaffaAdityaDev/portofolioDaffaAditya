import React, { useState, useRef, useEffect } from 'react';
import Prism from 'prismjs';

// Import languages
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

// Import Prism CSS theme
import 'prismjs/themes/prism-tomorrow.css';

interface CodeBlockProps {
  children: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children]);

  return (
    <div className="my-6 border border-neutral-800 bg-[#0d0d0d] rounded-sm relative group">
      <div className="flex items-center justify-between px-3 py-1 border-b border-neutral-800 bg-neutral-900/50 text-xs font-mono text-neutral-500">
        <span>CODE</span>
        <button 
          onClick={handleCopy}
          className="hover:text-white transition-colors uppercase cursor-pointer"
        >
          {copySuccess ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono text-neutral-300">
        <pre className="whitespace-pre">
          <code ref={codeRef} className={className}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
