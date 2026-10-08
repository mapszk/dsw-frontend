import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom no implementa estas APIs que usan los componentes de Radix (Select, Dialog)
Element.prototype.scrollIntoView ??= vi.fn();
Element.prototype.hasPointerCapture ??= vi.fn(() => false);
Element.prototype.releasePointerCapture ??= vi.fn();
