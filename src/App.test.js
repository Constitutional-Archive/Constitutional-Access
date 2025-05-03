// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App Component', () => {
  test('renders Navbar component', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const navs = screen.getAllByRole('navigation');
    expect(navs.length).toBeGreaterThan(0);

  });

  test('renders HomePage on default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test('renders SearchPage on /search route', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /what do you want to search/i })).toBeInTheDocument();
  });
  test('renders API Docs link in the Navbar', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const links = screen.getAllByRole('link', { name: /api docs/i });
    expect(links).toHaveLength(2);

  });
  
  test('renders Login button in the Navbar', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const loginButtons = screen.getAllByRole('button', { name: /login/i });
    expect(loginButtons).toHaveLength(2); // or whatever is expected

  });
  
  test('navigates to SearchPage when clicking Search link', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const searchLinks = screen.getAllByRole('link', { name: /search/i });
    expect(searchLinks).toHaveLength(2); // or some other check based on your test case
    expect(searchLinks[0]).toHaveAttribute('href', '/search'); // check the first one
    expect(searchLinks[1]).toHaveAttribute('href', '/search'); // check the second one

  });
  
  test('renders a search input on /search route', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText(/ask anything about constitutional documents/i);
    expect(searchInput).toBeInTheDocument();
  });

  // ... other tests
});
