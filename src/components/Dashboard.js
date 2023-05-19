import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import "./Dashboard.css"

function Dashboard() {
  const [savedData, setSavedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listRef = firestore.collection('lists');
        const snapshot = await listRef.get();
        const data = snapshot.docs.map((doc) => doc.data());
        setSavedData(data);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-parent-div">
      <h1>Dashboard</h1>
      <ul>
        {savedData.map((item, index) => (
          <li className="dashboard_list" key={index}>{item.todos.join(' ')}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;