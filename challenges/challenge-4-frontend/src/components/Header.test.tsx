import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { TaskProvider } from '../context/TaskContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { Header } from './Header';

const setup = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <TaskProvider>
          <ToastProvider>
            <Header />
          </ToastProvider>
        </TaskProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('renders header with navigation', () => {
    setup();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders help button', () => {
    setup();
    const helpButton = screen.getByRole('button', { name: /help|shortcuts|\?/i });
    expect(helpButton).toBeInTheDocument();
  });

  it('opens shortcut help modal when help button is clicked', async () => {
    const user = userEvent.setup();
    setup();

    const helpButton = screen.getByRole('button', { name: /help|shortcuts|\?/i });
    await user.click(helpButton);

    await waitFor(() => {
      expect(screen.queryByText(/keyboard shortcut|help/i)).toBeInTheDocument();
    });
  });

  it('renders theme toggle button', () => {
    setup();
    const themeButton = screen.getByRole('button', { name: /theme|light|dark|sun|moon/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('renders undo button', () => {
    setup();
    const undoButton = screen.getByRole('button', { name: /undo|ctrl/i });
    expect(undoButton).toBeInTheDocument();
  });
});
