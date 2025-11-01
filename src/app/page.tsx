'use client';

import { useState } from 'react';
import Terminal from '@/components/Terminal';
import { TerminalLine } from '@/types/game';
import { TERMINAL_CONFIG } from '@/lib/constants';

export default function Home() {
  const [history, setHistory] = useState<TerminalLine[]>([
    // Welcome message
    ...TERMINAL_CONFIG.welcomeMessage.map((line, index) => ({
      type: 'system' as const,
      content: line,
      timestamp: Date.now() + index,
    })),
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDirectory] = useState('C:\\');

  const handleCommand = async (command: string) => {
    // Add user input to history
    const inputLine: TerminalLine = {
      type: 'input',
      content: command,
      timestamp: Date.now(),
    };
    
    setHistory(prev => {
      const newHistory = [...prev, inputLine];
      // Limit history size
      if (newHistory.length > 1000) {
        return newHistory.slice(-1000);
      }
      return newHistory;
    });
    
    setIsProcessing(true);

    // Simulate command processing with different responses
    setTimeout(() => {
      let response = '';
      const cmd = command.toLowerCase().trim();
      
      if (cmd === 'help') {
        response = Object.entries(TERMINAL_CONFIG.commands)
          .map(([cmd, desc]) => `${cmd.padEnd(10)} - ${desc}`)
          .join('\n');
      } else if (cmd === 'whoami') {
        response = 'Dr. Elara Myles';
      } else if (cmd === 'dir' || cmd === 'ls') {
        response = 'Directory listing not implemented yet.';
      } else if (cmd.startsWith('echo ')) {
        response = command.slice(5);
      } else if (cmd === 'cls' || cmd === 'clear') {
        // Clear screen
        setHistory([]);
        setIsProcessing(false);
        return;
      } else {
        response = `'${command}' is not recognized as an internal or external command.`;
      }
      
      const outputLine: TerminalLine = {
        type: cmd === 'whoami' ? 'ai' : 'output',
        content: response,
        timestamp: Date.now(),
      };
      
      setHistory(prev => [...prev, outputLine]);
      setIsProcessing(false);
    }, Math.random() * 800 + 200); // Variable delay for realism
  };

  return (
    <Terminal
      onCommand={handleCommand}
      history={history}
      isProcessing={isProcessing}
      currentDirectory={currentDirectory}
    />
  );
}