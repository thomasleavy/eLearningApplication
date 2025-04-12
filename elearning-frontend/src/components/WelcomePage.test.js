//welcomepage.test.js
// import React from 'react';
import { render, screen } from '@testing-library/react';
import WelcomePage from './WelcomePage';
import { BrowserRouter } from 'react-router-dom';

describe('WelcomePage Component', () => {
  test.skip('renders registration & login forms', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    const registerHeader = screen.getByText(/Register/i);
    const loginHeader = screen.getByText(/Login/i);
    expect(registerHeader).toBeInTheDocument();
    expect(loginHeader).toBeInTheDocument();
    const emailInputs = screen.getAllByPlaceholderText(/Email/i);
    expect(emailInputs.length).toBeGreaterThanOrEqual(2);
  });
});
