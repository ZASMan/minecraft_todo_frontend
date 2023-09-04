import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import { Trash, Pencil } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { Plus, Dash } from 'react-bootstrap-icons';
import "./Dashboard.css";

function Dashboard() {
  const [savedData, setSavedData] = useState([]);
  const [expandedLists, setExpandedLists] = useState({}); // State to track expanded lists
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const listRef = collection(firestore, 'lists');
        const snapshot = await getDocs(listRef);
        const data = snapshot.docs.map((doc) => {
          const id = doc.id;
          const listData = doc.data();
          return { id, ...listData };
        });
        const filteredData = data.filter((list) => list.userId === uid);
        setSavedData(filteredData);
      }
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTodoToggle = async (listIndex, todoIndex) => {
    try {
      const newList = savedData.map((list) => ({ ...list }));
      const list = newList[listIndex];
      const todo = list.todos[todoIndex];

      if (todo) {
        todo.completed = !todo.completed;

        await updateDoc(doc(firestore, 'lists', list.id), {
          todos: list.todos,
        });

        setSavedData(newList);
      } else {
        console.error('Invalid list or todo index');
      }
    } catch (error) {
      console.error('Error updating todo item:', error);
    }
  };

  const handleQuantityChange = async (listIndex, todoIndex, quantity) => {
    try {
      const newList = savedData.map((list) => ({ ...list }));
      const list = newList[listIndex];
      const todo = list.todos[todoIndex];

      if (todo) {
        todo.quantity = parseInt(quantity, 10);

        await updateDoc(doc(firestore, 'lists', list.id), {
          todos: list.todos,
        });

        setSavedData(newList);
      } else {
        console.error('Invalid list or todo index');
      }
    } catch (error) {
      console.error('Error updating todo quantity:', error);
    }
  };

  const handleListDelete = async (listIndex) => {
    try {
      const list = savedData[listIndex];

      if (list.todos.some(todo => todo.completed)) {
        const confirmDelete = window.confirm(
          'Are you sure you want to delete this list? There are completed todo items in it.'
        );

        if (!confirmDelete) {
          return;
        }
      }

      await deleteDoc(doc(firestore, 'lists', list.id));
      const newList = savedData.filter((_, index) => index !== listIndex);
      setSavedData(newList);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleDeleteTodoItem = async (listIndex, todoIndex) => {
    try {
      const newList = savedData.map((list) => ({ ...list }));
      const list = newList[listIndex];
      const todo = list.todos[todoIndex];

      if (todo) {
        list.todos.splice(todoIndex, 1);

        await updateDoc(doc(firestore, 'lists', list.id), {
          todos: list.todos,
        });

        setSavedData(newList);
      } else {
        console.error('Invalid list or todo index');
      }
    } catch (error) {
      console.error('Error deleting todo item:', error);
    }
  };

  const handleEditList = (listIndex) => {
    const listData = savedData[listIndex];
    navigate(`/lists/${listData.id}`, {
      state: {
        listData, // Pass the listData to the "lists" route
        isEditing: true, // Set isEditing to true when editing
      },
    });
  }


  const handleToggleCollapse = (listIndex) => {
      setExpandedLists((prevExpandedLists) => ({
        ...prevExpandedLists,
        [listIndex]: !prevExpandedLists[listIndex],
      }));
    };


  return (
    <div className="dashboard-parent-div">
      <h1 className="dashboard-header">Dashboard</h1>
      {savedData.length === 0 ? (
        <p>No lists found</p>
      ) : (
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            {savedData.map((list, listIndex) => (
              <div className="col col_style" key={listIndex}>
                <div className="dashboard-list-container">
                  <h2 className="list-title">Project: {list.title}</h2>
                  {list.todos.slice(0, expandedLists[listIndex] ? list.todos.length : 8).map((todo, todoIndex) => (
                    <div className="todo-item" key={todoIndex}>
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleTodoToggle(listIndex, todoIndex)}
                        />
                        <input
                          className="quantity-input"
                          type="number"
                          value={todo.quantity}
                          min="0"
                          onChange={(e) => handleQuantityChange(listIndex, todoIndex, e.target.value)}
                        />
                        <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>{todo.text}</span>
                        <Trash
                          className="trash-icon"
                          onClick={() => handleDeleteTodoItem(listIndex, todoIndex)}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="list-description">Notes: {list.description}</p>
                  {list.todos.length > 8 && (
                    <button
                      className="btn btn-link"
                      onClick={() => handleToggleCollapse(listIndex)}
                    >
                      {expandedLists[listIndex] ? <Dash /> : <Plus />}
                    </button>
                  )}

                  <Pencil
                    className="list-edit-button btn btn-primary"
                    onClick={() => handleEditList(listIndex)}
                  />
                  <Trash
                    className="list-delete-button btn btn-danger"
                    onClick={() => handleListDelete(listIndex)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
