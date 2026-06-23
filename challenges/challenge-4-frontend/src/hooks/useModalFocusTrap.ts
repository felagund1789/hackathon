import { RefObject, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function useModalFocusTrap(containerRef: RefObject<HTMLElement>, onClose?: () => void): void {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const getFocusableElements = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
        return !element.hasAttribute('disabled') && element.tabIndex !== -1;
      });

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      container.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const currentFocusableElements = getFocusableElements();
      if (currentFocusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = currentFocusableElements[0];
      const lastElement = currentFocusableElements[currentFocusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [containerRef, onClose]);
}
