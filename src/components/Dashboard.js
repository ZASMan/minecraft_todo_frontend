import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import "./Dashboard.css";
import Badge from 'react-bootstrap/Badge';
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';

function Dashboard() {
  const [savedData, setSavedData] = useState([]);

  useEffect(() => {
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
          const filteredData = data.filter((list) => list.userId === uid); // Filter lists by user's UID
          setSavedData(filteredData);
        }
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (listIndex, todoIndex) => {
    try {
      const newList = [...savedData];
      const list = newList[listIndex];

      if (list && list.todos && list.todos.length > todoIndex) {
        list.todos.splice(todoIndex, 1); // Remove the todo item from the array

        if (list.todos.length === 0) {
          // If the list is empty, delete the entire list from Firestore
          await deleteDoc(doc(firestore, 'lists', list.id));
          newList.splice(listIndex, 1); // Remove the list from the local state
        } else {
          // Update the todos array in Firestore
          await updateDoc(doc(firestore, 'lists', list.id), {
            todos: list.todos,
          });
        }

        setSavedData(newList);
      } else {
        console.error('Invalid list or todo index');
      }
    } catch (error) {
      console.error('Error deleting todo item:', error);
    }
  };

  const handleListDelete = async (listIndex) => {
    const list = savedData[listIndex];

    if (list.todos.length > 0) {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete this list? There are still todo items in it.'
      );

      if (!confirmDelete) {
        return;
      }
    }

    try {
      await deleteDoc(doc(firestore, 'lists', list.id));
      const newList = [...savedData];
      newList.splice(listIndex, 1); // Remove the list from the local state
      setSavedData(newList);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  return (
    <div className="dashboard-parent-div">
      <h1>Dashboard</h1>
      {savedData.length === 0 ? (
        <p>No lists found</p>
      ) : (
        <div>
          {savedData.map((list, listIndex) => (
            <div className="dashboard_list" key={listIndex}>
              {list.todos.map((todo, todoIndex) => (
                <Badge pill variant="primary" className="mr-1 todo_badge" key={todoIndex}>
                  {todo}
                  <button
                    className="close"
                    onClick={() => handleDelete(listIndex, todoIndex)}
                  >
                    &times;
                  </button>
                </Badge>
              ))}
              <button
                className="list-delete-button"
                onClick={() => handleListDelete(listIndex)}
              >
                Delete List
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
