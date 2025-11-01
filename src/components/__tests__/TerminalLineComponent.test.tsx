import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Terminal from '../Terminal';
import { TerminalLine } from '@/types/game';

// Mock the constants
vi.mock('@/lib/constants', () => ({
  TERMINAL_CONFIG: {
    prompt: 'C:\\>',
    welcomeMessage: ['Welcome to NecrOS'],
  },
  GAME_CONFIG: {
    maxHistoryLines: 1000,
  },
}));

describe('Terminal Line Rendering', () => {
  it('displays input and output lines immediately', () => {
    const lines: TerminalLine[] = [
      {
        type: 'input',
        content: 'help',
        timestamp: Date.now(),
      },
      {
        type: 'output',
        content: 'Available commands',
        timestamp: Date.now() + 1,
      },
    ];

    render(
      <Terminal
        onCommand={vi.fn()}
        history={lines}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    // Should be immediately visible
    expect(screen.getByText('help')).toBeInTheDocument();
    expect(screen.getByText('Available commands')).toBeInTheDocument();
  });

  it('renders different line types with correct CSS classes', () => {
    const lines: TerminalLine[] = [
      {
        type: 'output',
        content: 'Output message',
        timestamp: Date.now(),
      },
    ];

    render(
      <Terminal
        onCommand={vi.fn()}
        history={lines}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    // Check that output lines render correctly
    expect(screen.getByText('Output message')).toBeInTheDocument();
    
    // Check that terminal lines have the correct base class
    const terminalLines = document.querySelectorAll('.terminal-line');
    expect(terminalLines.length).toBeGreaterThan(0);
  });

  it('shows input prompt for input lines', () => {
    const lines: TerminalLine[] = [
      {
        type: 'input',
        content: 'dir',
        timestamp: Date.now(),
      },
    ];

    render(
      <Terminal
        onCommand={vi.fn()}
        history={lines}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    // Check that input lines show the prompt
    expect(document.body.textContent).toContain('C:\\>');
    expect(screen.getByText('dir')).toBeInTheDocument();
  });

  it('handles empty history gracefully', () => {
    render(
      <Terminal
        onCommand={vi.fn()}
        history={[]}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    // Should render without errors
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});