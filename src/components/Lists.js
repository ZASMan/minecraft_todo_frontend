import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';
import Button from 'react-bootstrap/Button';
import { Trash } from 'react-bootstrap-icons';
import "./Lists.css"

function TodoList({ authUser }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [variants, setVariants] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [showQuantityInputs, setShowQuantityInputs] = useState(false);
  const navigate = useNavigate();
  const { listId } = useParams();
  
  useEffect(() => {
    const fetchList = async () => {
      try {
        const listDocRef = doc(firestore, 'lists', listId);
        const listSnapshot = await getDoc(listDocRef);

        if (listSnapshot.exists()) {
          const listData = listSnapshot.data();
          setTitle(listData.title);
          setDescription(listData.description);
          setTodos(listData.todos.map((todo) => todo.text));
          setQuantities(listData.todos.map((todo) => todo.quantity || 0));
        }
      } catch (error) {
        console.error('Error fetching list from Firestore:', error);
      }
    };

    fetchList();
  }, [listId]);

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleSave = async () => {
    try {
      const listRef = collection(firestore, 'lists');
      const newTodosWithCompleted = todos.map((todo, index) => ({
        text: todo,
        completed: false,
        quantity: quantities[index] || 0,
      }));
  
      // Using Firebase's Timestamp for the createdAt field
      await addDoc(listRef, {
        userId: authUser.uid,
        title,
        description,
        todos: newTodosWithCompleted,
        createdAt: serverTimestamp(), // Updated to use Firebase's Timestamp
      });
  
      console.log('List saved to Firestore!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving list to Firestore:', error);
    }
  
    setShowQuantityInputs(false);
  };
  
  

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTodos = selectedOptions.map((option) => option.label);
    setTodos([...todos, ...newTodos]);
    setSelectedOptions([]);
    setQuantities([...quantities, ...new Array(newTodos.length).fill(0)]);
    setShowQuantityInputs(true);
  };

  const handleDelete = (index) => {
    const newTodos = [...todos];
    const newQuantities = [...quantities];
    newTodos.splice(index, 1);
    newQuantities.splice(index, 1);
    setTodos(newTodos);
    setQuantities(newQuantities);
  };

  useEffect(() => {
    axios
      .get('http://localhost:9292/v1/minecraft_items/variants')
      .then((response) => {
        const dataArr = response.data;
        const dataArrParsed = JSON.parse(dataArr);
        setVariants(dataArrParsed.map((variant) => ({ label: variant, value: variant })));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = parseInt(value, 10);
    setQuantities(newQuantities);
  };

  return (
    <div className="background_img">
    <div className="jsx_wrapper_div">
      <h1 className="form_header_h1">Pick some items for your build</h1>
      <form className='lists-form' onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description"
          required
        />
        <Select
          isMulti
          options={variants}
          value={selectedOptions}
          onChange={handleSelectChange}
          placeholder="Select some items..."
          isSearchable
          closeMenuOnSelect={false}
        />
        <Button className="add_button" variant="secondary" type="submit">
          Add Todo
        </Button>
      </form>

      <ul className="todo_item_list">
        {todos.map((todo, index) => (
          <li className="todo_item" key={index}>
            {showQuantityInputs && (
              <input
                className="quantity-input-lists"
                type="number"
                value={quantities[index] || ''}
                min="0"
                onChange={(e) => handleQuantityChange(index, e.target.value)}
              />
            )}
            {todo}{' '}
            <Trash
              className="trash-icon"
              onClick={() => handleDelete(index)}
            />
          </li>
        ))}
      </ul>
      {todos.length > 0 && (
        <Button className="save_button" variant="primary" onClick={handleSave}>
          Save
        </Button>
      )}
    </div>
    </div>
  );
}

export default TodoList;
