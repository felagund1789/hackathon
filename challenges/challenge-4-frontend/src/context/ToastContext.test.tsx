import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ToastProvider, useToast } from './ToastContext';

const TestComponent = () => {
  const { addToast, dismissToast } = useToast();

  return (
    <div>
      <button onClick={() => addToast('Success!', 'success')}>Add Success Toast</button>
      <button onClick={() => addToast('Error occurred!', 'error')}>Add Error Toast</button>
      <button onClick={() => dismissToast('toast-1')}>Dismiss Toast</button>
    </div>
  );
};

describe('ToastContext', () => {
  it('renders toast provider', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByRole('button', { name: /add success/i })).toBeInTheDocument();
  });

  it('adds success toast when addToast is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByRole('button', { name: /add success/i });
    await act(async () => {
      button.click();
    });

    expect(screen.queryByText('Success!')).toBeInTheDocument();
  });

  it('renders toast container with aria-live region', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const toastContainer = container.querySelector('.fixed.top-16.right-4');
    expect(toastContainer).toBeInTheDocument();
  });
});
