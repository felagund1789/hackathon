import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskCardSkeleton } from './TaskCardSkeleton';

describe('TaskCardSkeleton', () => {
  it('renders skeleton placeholder', () => {
    const { container } = render(<TaskCardSkeleton />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('has aria-hidden attribute for accessibility', () => {
    const { container } = render(<TaskCardSkeleton />);
    expect(container.querySelector('article')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has shimmer animation class', () => {
    const { container } = render(<TaskCardSkeleton />);
    const div = container.querySelector('[class*="animate-skeleton-shimmer"]');
    expect(div).toBeInTheDocument();
  });

  it('renders with compact padding when compact prop is true', () => {
    const { container } = render(<TaskCardSkeleton compact={true} />);
    const article = container.querySelector('article');
    expect(article).toHaveClass('p-3');
  });

  it('renders with normal padding when compact prop is false', () => {
    const { container } = render(<TaskCardSkeleton compact={false} />);
    const article = container.querySelector('article');
    expect(article).toHaveClass('p-4');
  });

  it('contains multiple gray placeholder bars', () => {
    const { container } = render(<TaskCardSkeleton />);
    const placeholders = container.querySelectorAll('[class*="bg-gray"]');
    expect(placeholders.length).toBeGreaterThan(0);
  });
});
