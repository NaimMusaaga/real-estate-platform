import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('fires onClick when enabled', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>احفظ</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'احفظ' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disables the button and blocks clicks while isLoading', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} isLoading>
        احفظ
      </Button>,
    );
    // Not queried by accessible name here: the Spinner's "جارٍ التحميل" aria-label
    // is folded into the button's computed name while loading, so a fixed-name
    // query would be brittle against that (arguably-desirable) a11y behavior.
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('respects an explicit disabled prop independently of isLoading', () => {
    render(<Button disabled>احفظ</Button>);
    expect(screen.getByRole('button', { name: 'احفظ' })).toBeDisabled();
  });
});
