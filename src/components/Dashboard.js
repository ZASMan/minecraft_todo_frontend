import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Trash, Pencil, ChevronUp, ChevronDown } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import { collection, getDocs, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';

function Dashboard() {
  const [savedData, setSavedData] = useState([]);
  const [expandedListId, setExpandedListId] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid; // Get the logged-in user's UID
        const listRef = collection(firestore, 'lists');
        
        // Query Firestore to only return lists where userId matches the logged-in user
        const q = query(listRef, where('userId', '==', uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const id = doc.id;
          const listData = doc.data();
          return { id, ...listData };
        });

        setSavedData(data); // Set the filtered data to state
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
    const listId = savedData[listIndex].id;
    navigate(`/lists/edit/${listId}`);
  };

  const handleToggleExpand = (listId) => {
    setExpandedListId(expandedListId === listId ? null : listId);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {props.children}
    </Tooltip>
  );

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
                  <h2 className="list-title">{list.title ? list.title : "No Title"}</h2>
                  <label className="list-description-label">Description:</label>
                  <p className="list-description">{list.description ? list.description : "No Description"}</p>
                  {list.todos.length > 5 ? (
                    <>
                      {list.todos.slice(0, 5).map((todo, todoIndex) => (
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
                            <OverlayTrigger
                              placement="top"
                              overlay={renderTooltip({ children: 'Delete this todo item' })}
                            >
                              <Trash
                                className="trash-icon"
                                onClick={() => handleDeleteTodoItem(listIndex, todoIndex)}
                              />
                            </OverlayTrigger>
                          </div>
                        </div>
                      ))}
                      {expandedListId === list.id && (
                        <>
                          {list.todos.slice(5).map((todo, todoIndex) => (
                            <div className="todo-item" key={todoIndex + 5}>
                              <div className="d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  checked={todo.completed}
                                  onChange={() => handleTodoToggle(listIndex, todoIndex + 5)}
                                />
                                <input
                                  className="quantity-input"
                                  type="number"
                                  value={todo.quantity}
                                  min="0"
                                  onChange={(e) => handleQuantityChange(listIndex, todoIndex + 5, e.target.value)}
                                />
                                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>{todo.text}</span>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={renderTooltip({ children: 'Delete this todo item' })}
                                >
                                <Trash
                                  className="trash-icon"
                                  onClick={() => handleDeleteTodoItem(listIndex, todoIndex + 5)}
                                />
                                </OverlayTrigger>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      <span 
                        className="chevron-toggle"
                        onClick={() => handleToggleExpand(list.id)}
                      >
                        {expandedListId === list.id ? (
                          <>
                            <ChevronUp /> Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown /> Show More
                          </>
                        )}
                      </span>
                    </>
                  ) : (
                    list.todos.map((todo, todoIndex) => (
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
                          <OverlayTrigger
                              placement="top"
                              overlay={renderTooltip({ children: 'Delete this todo item' })}
                            >
                          <Trash
                            className="trash-icon"
                            onClick={() => handleDeleteTodoItem(listIndex, todoIndex)}
                          />
                          </OverlayTrigger>
                        </div>
                      </div>
                    ))
                  )}
                  <div className="list-actions">
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip({ children: 'Edit this list' })}
                    >
                      <Pencil
                        className="list-edit-button btn btn-primary"
                        onClick={() => handleEditList(listIndex)}
                      />
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip({ children: 'Delete this list' })}
                    >
                      <Trash
                        className="list-delete-button btn btn-danger"
                        onClick={() => handleListDelete(listIndex)}
                      />
                    </OverlayTrigger>
                  </div>
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
