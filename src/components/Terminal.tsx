'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { TerminalProps, TerminalLine } from '@/types/terminal';
import { TERMINAL_CONFIG, GAME_CONFIG } from '@/lib/constants';

export default function Terminal({ 
  onCommand, 
  history, 
  isProcessing, 
  currentDirectory 
}: TerminalProps) {
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-focus input and scroll to bottom
  useEffect(() => {
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  }, [isProcessing]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // TODO: Implement tab completion in future tasks
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      // Clear current input
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      // TODO: Clear screen functionality for future tasks
    }
  };

  const handleCommand = () => {
    if (currentInput.trim()) {
      // Add to command history with limit
      const newHistory = [...commandHistory, currentInput];
      if (newHistory.length > GAME_CONFIG.maxHistoryLines) {
        newHistory.shift(); // Remove oldest command
      }
      setCommandHistory(newHistory);
      setHistoryIndex(-1);
      
      // Execute command
      onCommand(currentInput);
      setCurrentInput('');
    }
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;

    let newIndex = historyIndex;
    
    if (direction === 'up') {
      if (historyIndex === -1) {
        newIndex = commandHistory.length - 1;
      } else if (historyIndex > 0) {
        newIndex = historyIndex - 1;
      }
    } else { // down
      if (historyIndex === -1) {
        return; // Already at bottom
      } else if (historyIndex < commandHistory.length - 1) {
        newIndex = historyIndex + 1;
      } else {
        newIndex = -1; // Go to empty input
      }
    }

    setHistoryIndex(newIndex);
    setCurrentInput(newIndex === -1 ? '' : commandHistory[newIndex]);
  };

  const formatPrompt = () => {
    return currentDirectory ? `${currentDirectory}>` : TERMINAL_CONFIG.prompt;
  };

  return (
    <div className="crt-screen min-h-screen w-full bg-terminal-bg text-terminal-fg font-mono overflow-hidden">
      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="terminal-content h-screen overflow-y-auto p-4 pb-20"
      >
        {/* Terminal history */}
        <div className="terminal-history">
          {history.map((line, index) => (
            <TerminalLineComponent key={`${line.timestamp}-${index}`} line={line} />
          ))}
        </div>

        {/* Current input line */}
        {!isProcessing && (
          <div className="terminal-input-line flex items-center mt-2">
            <span className="terminal-prompt mr-2 text-terminal-fg">
              {formatPrompt()}
            </span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="terminal-input bg-transparent border-none outline-none text-terminal-fg font-mono w-full"
                disabled={isProcessing}
                autoComplete="off"
                spellCheck={false}
              />
              {/* Blinking cursor */}
              <span 
                className="terminal-cursor absolute top-0 w-2 h-5 bg-terminal-cursor"
                style={{ left: `${currentInput.length * 0.6}em` }}
              />
            </div>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="terminal-processing flex items-center mt-2">
            <span className="terminal-prompt mr-2 text-terminal-fg">
              {formatPrompt()}
            </span>
            <span className="processing-text">Processing...</span>
            <span className="terminal-cursor w-2 h-5 bg-terminal-cursor ml-1" />
          </div>
        )}
      </div>
    </div>
  );
}

// Component for rendering individual terminal lines
function TerminalLineComponent({ line }: { line: TerminalLine }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Typewriter effect for AI and system responses
    if (line.type === 'ai' || line.type === 'system') {
      setDisplayedText('');
      setIsComplete(false);
      
      let currentIndex = 0;
      const typewriterSpeed = line.type === 'ai' ? 40 : 20; // Slower for AI responses
      
      const typewriterInterval = setInterval(() => {
        if (currentIndex < line.content.length) {
          setDisplayedText(line.content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(typewriterInterval);
        }
      }, typewriterSpeed);

      return () => clearInterval(typewriterInterval);
    } else {
      // Immediate display for input and output
      setDisplayedText(line.content);
      setIsComplete(true);
    }
  }, [line.content, line.type]);

  const getLineClass = () => {
    const baseClass = "terminal-line leading-tight";
    switch (line.type) {
      case 'input':
        return `${baseClass} text-terminal-fg`;
      case 'output':
        return `${baseClass} text-terminal-fg`;
      case 'system':
        return `${baseClass} text-terminal-fg opacity-80`;
      case 'ai':
        return `${baseClass} text-terminal-fg font-bold`;
      default:
        return baseClass;
    }
  };

  const shouldShowEffects = line.effects && line.effects.length > 0;

  return (
    <div className={getLineClass()}>
      {line.type === 'input' && (
        <span className="terminal-prompt mr-2">C:\&gt;</span>
      )}
      <span 
        className={shouldShowEffects ? 'glitch-text' : ''}
        data-text={displayedText}
      >
        {displayedText}
      </span>
      {/* Show cursor during typewriter effect */}
      {(line.type === 'ai' || line.type === 'system') && !isComplete && (
        <span className="terminal-cursor w-2 h-5 bg-terminal-cursor ml-1 inline-block" />
      )}
    </div>
  );
}