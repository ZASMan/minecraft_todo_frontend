export const authUser = { uid: "test-user-id", email: "test@example.com" };

const mockTodos = [
  {
    id: "todo1",
    text: "Bamboo",
    completed: false,
    quantity: 25,
  },
  {
    id: "todo2",
    text: "Oak Wood",
    completed: true,
    quantity: 10,
  },
];

const mockLists = [
  {
    id: "list1",
    data: () => ({
      title: "Farming Materials",
      description: "A list of farming materials",
      userId: authUser.uid,
      createdAt: new Date(),
      todos: mockTodos,
    }),
  },
  {
    id: "list2",
    data: () => ({
      title: "Building Materials",
      description: "A list of building materials",
      userId: authUser.uid,
      createdAt: new Date(),
      todos: [],
    }),
  },
];

// Mock Firestore behavior
export const getFirestore = jest.fn();

export const collection = jest.fn(() => ({
  where: jest.fn(() => ({
    orderBy: jest.fn(() => ({
      getDocs: jest.fn(() => Promise.resolve({ docs: mockLists })),
    })),
  })),
}));

export const updateDoc = jest.fn();
export const deleteDoc = jest.fn();
