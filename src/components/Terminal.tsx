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
            <span className="terminal-prompt mr-2 text-white">
              {formatPrompt()}
            </span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="terminal-input bg-transparent border-none outline-none text-white font-mono w-full"
                disabled={isProcessing}
                autoComplete="off"
                spellCheck={false}
              />
              {/* Blinking cursor */}
              <span
                className="terminal-cursor absolute top-0 w-2 h-5 bg-green-400 animate-pulse"
                style={{ left: `${currentInput.length * 0.6}em` }}
              />
            </div>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="terminal-processing flex items-center mt-2">
            <span className="terminal-prompt mr-2 text-white">
              {formatPrompt()}
            </span>
            <span className="processing-text text-green-400">Processing...</span>
            <span className="terminal-cursor w-2 h-5 bg-green-400 ml-1 animate-pulse" />
          </div>
        )}
      </div>

      <style jsx>{`
        .glitch-text {
          position: relative;
          animation: glitch 0.3s ease-in-out;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-text::before {
          animation: glitch-1 0.3s ease-in-out;
          color: #ff00ff;
          z-index: -1;
        }

        .glitch-text::after {
          animation: glitch-2 0.3s ease-in-out;
          color: #00ffff;
          z-index: -2;
        }

        @keyframes glitch {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }

        @keyframes glitch-1 {
          0% { transform: translateX(0); clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); }
          50% { transform: translateX(-2px); }
          100% { transform: translateX(0); clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%); }
        }

        @keyframes glitch-2 {
          0% { transform: translateX(0); clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%); }
          50% { transform: translateX(2px); }
          100% { transform: translateX(0); clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); }
        }

        .color-shift {
          animation: colorShift 0.8s ease-in-out;
        }

        @keyframes colorShift {
          0% { color: #00ff41; }
          25% { color: #ff00ff; }
          50% { color: #00ffff; }
          75% { color: #ffff00; }
          100% { color: #00ff41; }
        }

        .text-flicker {
          animation: textFlicker 3s infinite;
        }

        @keyframes textFlicker {
          0%, 98% { opacity: 1; }
          99% { opacity: 0.8; }
          100% { opacity: 1; }
        }

        .phantom-text {
          animation: phantom 1s ease-in-out;
          opacity: 0.7;
        }

        @keyframes phantom {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }

        .text-corruption {
          animation: textCorruption 0.5s ease-in-out;
        }

        @keyframes textCorruption {
          0%, 100% { filter: blur(0); }
          25% { filter: blur(2px) hue-rotate(90deg); }
          50% { filter: blur(1px) hue-rotate(180deg); }
          75% { filter: blur(3px) hue-rotate(270deg); }
        }

        .slow-text {
          animation: slowType 2s steps(10, end);
        }

        @keyframes slowType {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
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
    let classes = 'terminal-line leading-tight ';

    // Color based on type (following playout)
    switch (line.type) {
      case 'input':
        classes += 'text-white ';
        break;
      case 'output':
        classes += 'text-green-400 ';
        break;
      case 'system':
        classes += 'text-green-400 ';
        break;
      case 'ai':
        classes += 'text-cyan-400 ';
        break;
      case 'error':
        classes += 'text-red-400 ';
        break;
      case 'warning':
        classes += 'text-yellow-400 ';
        break;
      default:
        classes += 'text-green-400 ';
    }

    // Add effect classes (following playout)
    if (line.effects) {
      if (line.effects.includes('flicker')) classes += 'animate-pulse ';
      if (line.effects.includes('glitch')) classes += 'glitch-text ';
      if (line.effects.includes('colorShift')) classes += 'color-shift ';
      if (line.effects.includes('phantomText')) classes += 'phantom-text ';
      if (line.effects.includes('textCorruption')) classes += 'text-corruption ';
      if (line.effects.includes('slowText')) classes += 'slow-text ';
      if (line.effects.includes('textFlicker')) classes += 'text-flicker ';
    }

    return classes;
  };

  return (
    <div className={getLineClass()}>
      {line.type === 'input' && (
        <span className="text-white mr-2">C:\&gt;</span>
      )}
      <span data-text={displayedText}>
        {displayedText}
      </span>
      {/* Show cursor during typewriter effect */}
      {(line.type === 'ai' || line.type === 'system') && !isComplete && (
        <span className="inline-block ml-1 w-2 h-4 bg-green-400 animate-pulse" />
      )}
    </div>
  );
}