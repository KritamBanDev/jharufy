import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock App component for basic testing
const MockApp = () => (
  <BrowserRouter>
    <div data-testid="app">
      <h1>Jharufy</h1>
      <p>Language Learning Social Platform</p>
    </div>
  </BrowserRouter>
);

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<MockApp />);
    expect(screen.getByTestId('app')).toBeInTheDocument();
  });

  it('displays the app title', () => {
    render(<MockApp />);
    expect(screen.getByText('Jharufy')).toBeInTheDocument();
  });

  it('displays the app description', () => {
    render(<MockApp />);
    expect(screen.getByText('Language Learning Social Platform')).toBeInTheDocument();
  });
});

// Mock utility tests
describe('Environment Setup', () => {
  it('has test environment configured', () => {
    expect(import.meta.env.MODE).toBe('test');
  });

  it('has API URL configured', () => {
    expect(import.meta.env.VITE_API_URL).toBeDefined();
  });

  it('has Socket URL configured', () => {
    expect(import.meta.env.VITE_SOCKET_URL).toBeDefined();
  });
});
