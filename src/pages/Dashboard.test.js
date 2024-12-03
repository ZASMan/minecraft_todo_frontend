import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { AuthProvider } from "../context/AuthContext";
import { updateDoc, deleteDoc } from "../__mocks__/firebase";

// Mock Firestore methods
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => ({
    where: jest.fn(() => ({
      orderBy: jest.fn(() => ({
        getDocs: jest.fn(() =>
          Promise.resolve({
            docs: [
              {
                id: "list1",
                data: () => ({
                  title: "Farming Materials",
                  description: "A list of farming materials",
                  userId: "test-user-id",
                  createdAt: new Date(),
                  todos: [
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
                  ],
                }),
              },
            ],
          })
        ),
      })),
    })),
  })),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

const MockAuthProvider = ({ children }) => {
  const setAuthUser = jest.fn();

  return (
    <AuthProvider value={{ authUser: { uid: "test-user-id" }, setAuthUser }}>
      {children}
    </AuthProvider>
  );
};

describe("Dashboard Component", () => {
  beforeEach(async () => {
    render(
      <MockAuthProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </MockAuthProvider>
    );

    // Ensure the mock data is loaded and visible before running tests
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    await screen.findByText("Farming Materials");
  });

  test("should be able to check off a todo item", async () => {
    // Find the checkbox for the first todo
    const checkbox = await screen.findByLabelText(/Toggle Bamboo/i);
    fireEvent.click(checkbox);

    // Verify that updateDoc was called with the correct arguments
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      "todos[0].completed": true,
    });
  });

  test("should be able to increment the quantity up or down > 0", async () => {
    // Find the increment button for the first todo
    const incrementButton = screen.getByRole("button", { name: /increment Bamboo/i });
    fireEvent.click(incrementButton);

    // Verify that updateDoc was called with the incremented quantity
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      "todos[0].quantity": 26,
    });

    // Find the decrement button and simulate a click
    const decrementButton = screen.getByRole("button", { name: /decrement Bamboo/i });
    fireEvent.click(decrementButton);

    // Verify that updateDoc was called with the decremented quantity
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      "todos[0].quantity": 25,
    });
  });

  test("should be able to delete a todo item", async () => {
    // Find the delete button for the first todo
    const deleteTodoButton = screen.getByRole("button", { name: /delete Bamboo/i });
    fireEvent.click(deleteTodoButton);

    // Verify that updateDoc was called to remove the todo
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      todos: [
        {
          id: "todo2",
          text: "Oak Wood",
          completed: true,
          quantity: 10,
        },
      ],
    });
  });

  test("should be able to delete a list", async () => {
    // Find the delete button for the first list
    const deleteListButton = screen.getByRole("button", { name: /delete Farming Materials/i });
    fireEvent.click(deleteListButton);

    // Verify that deleteDoc was called with the correct document reference
    expect(deleteDoc).toHaveBeenCalledWith(expect.any(Object));
  });

  test("should navigate to edit list page", async () => {
    // Find the edit button for the first list
    const editListButton = screen.getByRole("button", { name: /edit Farming Materials/i });
    fireEvent.click(editListButton);

    // Verify that the navigation occurred (mocked or actual navigation)
    expect(window.location.pathname).toBe(`/editlist/list1`);
  });
});

