import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Trash, Pencil, ChevronUp, ChevronDown, AlarmFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import MinecraftSpinner from '../components/MinecraftSpinner';
import CustomModal from '../components/CustomModal';
import { collection, getDocs, deleteDoc, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';

function Dashboard() {
  const [savedData, setSavedData] = useState([]);
  const [expandedListId, setExpandedListId] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const listRef = collection(firestore, 'lists');
        const q = query(listRef, where('userId', '==', uid), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const id = doc.id;
          const listData = doc.data();
          return { id, ...listData };
        });

        setSavedData(data);
      }
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    let interval = Math.floor(seconds / 31536000);
  
    if (interval >= 1) return interval === 1 ? '1 year ago' : `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? '1 month ago' : `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? '1 day ago' : `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    return 'just now';
  };

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

  const handleListDelete = (listIndex) => {
    const list = savedData[listIndex];
    const hasCompletedTodos = list.todos.some(todo => todo.completed);
    
    const message = hasCompletedTodos
      ? 'There are completed todo items in this list. Are you sure you want to delete it?'
      : 'Are you sure you want to delete this list?';

    setModalContent({
      title: 'Confirm Deletion',
      body: message,
      onConfirm: async () => {
        await deleteDoc(doc(firestore, 'lists', list.id));
        const newList = savedData.filter((_, index) => index !== listIndex);
        setSavedData(newList);
        setShowModal(false); // Close the modal after deletion
      }
    });
    setShowModal(true);
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

  const handleToggleDescription = (listIndex) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [listIndex]: !prevState[listIndex],
    }));
    const listContainer = document.getElementById(`list-${listIndex}`);
    if (listContainer) {
      listContainer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {props.children}
    </Tooltip>
  );

  return (
    <div className="dashboard-parent-div">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="dashboard-header">Dashboard</h1>
          </div>
        </div>
        {loading ? (
          <MinecraftSpinner />
        ) : savedData.length === 0 ? (
          <p>No lists found</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-2">
            {savedData.map((list, listIndex) => {
              const isExpanded = expandedDescriptions[listIndex];
              const description = list.description || "No Description";
              const truncatedDescription = description.length > 40 ? `${description.slice(0, 40)}...` : description;
              const createdAt = list.createdAt ? list.createdAt.toDate() : null;
              const formattedTimeAgo = createdAt ? timeAgo(createdAt) : "Date unavailable";

              return (
                <div className="col" key={listIndex}>
                  <div className="dashboard-list-container">
                    <h2 className="list-title">{list.title || "No Title"}</h2>
                    <p className="list-created-at">Created: {formattedTimeAgo}<AlarmFill
                      size={9}
                      className='ms-1'
                      color='azure'
                      />  
                    </p>
                    
                    <label className="list-description-label">Description:</label>
                    <p className="list-description">
                      {isExpanded ? description : truncatedDescription}
                      {description.length > 40 && (
                        <span className="chevron-toggle" onClick={() => handleToggleDescription(listIndex)}>
                          {isExpanded ? (
                            <>
                              <ChevronUp /> Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown /> Show More
                            </>
                          )}
                        </span>
                      )}
                    </p>
                    {/* Render todos and actions */}
                    {list.todos.length > 5 ? (
                      <>
                        {list.todos.slice(0, 5).map((todo, todoIndex) => (
                          <div className="todo-item text-wrap" key={todoIndex}>
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
                              <OverlayTrigger placement="top" overlay={renderTooltip({ children: 'Delete this todo item' })}>
                                <Trash className="trash-icon" onClick={() => handleDeleteTodoItem(listIndex, todoIndex)} />
                              </OverlayTrigger>
                            </div>
                          </div>
                        ))}
  
                        {expandedListId === list.id && (
                          <>
                            {list.todos.slice(5).map((todo, todoIndex) => (
                              <div className="todo-item text-wrap" key={todoIndex + 5}>
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
                                  <OverlayTrigger placement="top" overlay={renderTooltip({ children: 'Delete this todo item' })}>
                                    <Trash className="trash-icon ms-auto" onClick={() => handleDeleteTodoItem(listIndex, todoIndex + 5)} />
                                  </OverlayTrigger>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                        <span className="chevron-toggle" onClick={() => handleToggleExpand(list.id)}>
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
                        <div className="todo-item text-wrap" key={todoIndex}>
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
                            <span className={`todo-text ms-2 ${todo.completed ? 'completed' : ''}`}>{todo.text}</span>
                            <OverlayTrigger placement="top" overlay={renderTooltip({ children: 'Delete this todo item' })}>
                              <Trash className="trash-icon ms-auto" onClick={() => handleDeleteTodoItem(listIndex, todoIndex)} />
                            </OverlayTrigger>
                          </div>
                        </div>
                      ))
                    )}
                    <div className="list-actions mt-3">
                      <OverlayTrigger placement="top" overlay={renderTooltip({ children: 'Edit this list' })}>
                        <Pencil className="list-edit-button btn btn-success" onClick={() => handleEditList(listIndex)} />
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={renderTooltip({ children: 'Delete this list' })}>
                        <Trash
                          className="list-delete-button btn btn-danger"
                          onClick={() => {
                            setModalContent({
                              title: 'Confirm Deletion',
                              body: 'Are you sure you want to delete this list?',
                              onConfirm: async () => {
                                await handleListDelete(listIndex);
                                setShowModal(false); // Close the modal after confirming
                              }
                            });
                            setShowModal(true); // Show the modal
                          }}
                        />
                      </OverlayTrigger>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={modalContent.title}
        body={modalContent.body}
        onConfirm={modalContent.onConfirm}
      />
    </div>
  );  
}

export default Dashboard;
