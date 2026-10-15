import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom no implementa estas APIs que usan los componentes de Radix (Select, Dialog, Slider)
Element.prototype.scrollIntoView ??= vi.fn();
Element.prototype.hasPointerCapture ??= vi.fn(() => false);
Element.prototype.releasePointerCapture ??= vi.fn();

// El Slider de Radix mide el thumb con ResizeObserver
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
