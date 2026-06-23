import { render, screen } from '@testing-library/react';
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
        <TaskProvider initialTasks={[]}>
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
    expect(screen.getByRole('button', { name: /show keyboard shortcuts/i })).toBeInTheDocument();
  });

  it('opens shortcut help modal when help button is clicked', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button', { name: /show keyboard shortcuts/i }));

    expect(await screen.findByRole('heading', { name: /keyboard shortcuts/i })).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    setup();
    expect(screen.getByRole('button', { name: /switch to .* mode/i })).toBeInTheDocument();
  });

  it('renders undo button', () => {
    setup();
    expect(screen.getByRole('button', { name: /undo last action/i })).toBeInTheDocument();
  });
});
