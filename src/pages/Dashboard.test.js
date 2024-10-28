import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { firestore, auth } from '../firebase'; // Import the mocked firestore and auth

// Automatically uses the mock from __mocks__/firebase.js
jest.mock('../firebase');

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders no lists found message when savedData is empty', async () => {
    // Mock the getDocs to return an empty array
    firestore.collection.mockReturnValueOnce({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getDocs: jest.fn(() => Promise.resolve({ docs: [] })), // Empty data
    });

    render(
      <AuthProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    expect(screen.getByText(/no lists found/i)).toBeInTheDocument();
  });

  test('renders lists when savedData is populated', async () => {
    // Mock the getDocs to return an array of lists
    const mockData = [
      { id: '1', title: 'This is a title' },
      { id: '2', title: 'Another title' },
    ];

    firestore.collection.mockReturnValueOnce({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getDocs: jest.fn(() => Promise.resolve({ docs: mockData.map(item => ({ id: item.id, data: () => item })) })),
    });

    render(
      <AuthProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    expect(screen.getByText('This is a title')).toBeInTheDocument();
    expect(screen.getByText('Another title')).toBeInTheDocument();
  });

  test('handles todo toggle', async () => {
    // Mock the getDocs to return an array of todos
    const mockData = [
      { id: '1', title: 'Toggle Item', completed: false },
    ];

    firestore.collection.mockReturnValueOnce({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getDocs: jest.fn(() => Promise.resolve({ docs: mockData.map(item => ({ id: item.id, data: () => item })) })),
    });

    render(
      <AuthProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

    const todoCheckbox = screen.getByRole('checkbox', { name: /toggle item/i });

    expect(todoCheckbox).not.toBeChecked();
    fireEvent.click(todoCheckbox);
    expect(todoCheckbox).toBeChecked();
  });

  // Additional tests could be added here for editing and deleting todos.
});
