import { jest } from '@jest/globals';

const mockDocs = [
  { id: '1', data: jest.fn(() => ({ userId: 'user123', createdAt: new Date(2023, 1, 1) })) },
  { id: '2', data: jest.fn(() => ({ userId: 'user123', createdAt: new Date(2023, 1, 2) })) },
];

// Mock for authentication
const auth = {
  onAuthStateChanged: jest.fn((callback) => {
    // Simulate a signed-in user
    callback({ uid: 'user123', email: 'test@example.com' }); // Change as needed
    return jest.fn(); // return an unsubscribe function
  }),
};

// Mock for Firestore
const firestore = {
  collection: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getDocs: jest.fn(() => Promise.resolve({ docs: mockDocs })),
  })),
};

// You can define additional mock functions if needed
const query = jest.fn(() => ({}));
const where = jest.fn(() => ({}));
const orderBy = jest.fn(() => ({}));
const getDocs = jest.fn((q) => {
  return Promise.resolve({
    docs: mockDocs.filter(doc => doc.data().userId === 'user123'), // Filter based on userId or criteria
  });
});

// Export the mocks
export { auth, firestore, query, where, orderBy, getDocs };

