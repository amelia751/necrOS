import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Terminal from '../Terminal';
import { TerminalLine } from '@/types/game';

// Mock the constants
vi.mock('@/lib/constants', () => ({
  TERMINAL_CONFIG: {
    prompt: 'C:\\>',
    welcomeMessage: ['Welcome to NecrOS'],
    commands: {
      help: 'Display available commands',
      dir: 'List directory contents',
    },
  },
  GAME_CONFIG: {
    maxHistoryLines: 1000,
  },
}));

describe('Terminal Component', () => {
  const mockOnCommand = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders terminal interface', () => {
    render(
      <Terminal
        onCommand={mockOnCommand}
        history={[]}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    // Check that terminal container exists
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays prompt with current directory', () => {
    render(
      <Terminal
        onCommand={mockOnCommand}
        history={[]}
        isProcessing={false}
        currentDirectory="C:\\SYSTEM"
      />
    );

    // Check for prompt text (accounting for double backslashes)
    expect(document.body.textContent).toContain('C:\\\\SYSTEM>');
  });

  it('handles command input', () => {
    render(
      <Terminal
        onCommand={mockOnCommand}
        history={[]}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnCommand).toHaveBeenCalledWith('help');
  });

  it('navigates command history with arrow keys', () => {
    render(
      <Terminal
        onCommand={mockOnCommand}
        history={[]}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    // Enter a command first
    fireEvent.change(input, { target: { value: 'dir' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Enter another command
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Navigate up in history
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('help');

    // Navigate up again
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('dir');

    // Navigate down
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('help');
  });

  it('clears input with Ctrl+C', () => {
    render(
      <Terminal
        onCommand={mockOnCommand}
        history={[]}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'some command' } });
    fireEvent.keyDown(input, { key: 'c', ctrlKey: true });

    expect(input.value).toBe('');
  });

  it('shows processing indicator when processing', () => {
    render(
      <Terminal
        onCommand={mockOnCommand}
        history={[]}
        isProcessing={true}
        currentDirectory="C:\\"
      />
    );

    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('renders terminal history lines', () => {
    const historyWithTypes: TerminalLine[] = [
      {
        type: 'input',
        content: 'help',
        timestamp: Date.now(),
      },
      {
        type: 'output',
        content: 'Available commands',
        timestamp: Date.now(),
      },
    ];

    render(
      <Terminal
        onCommand={mockOnCommand}
        history={historyWithTypes}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    expect(screen.getByText('help')).toBeInTheDocument();
    expect(screen.getByText('Available commands')).toBeInTheDocument();
  });

  it('prevents empty commands from being executed', () => {
    render(
      <Terminal
        onCommand={mockOnCommand}
        history={[]}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } }); // Only whitespace
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnCommand).not.toHaveBeenCalled();
  });

  it('displays blinking cursor', () => {
    render(
      <Terminal
        onCommand={mockOnCommand}
        history={[]}
        isProcessing={false}
        currentDirectory="C:\\"
      />
    );

    // Check for cursor element
    const cursors = document.querySelectorAll('.terminal-cursor');
    expect(cursors.length).toBeGreaterThan(0);
  });
});