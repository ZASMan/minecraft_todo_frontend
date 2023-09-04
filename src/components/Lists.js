import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, doc, addDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Button from 'react-bootstrap/Button';
import { Trash } from 'react-bootstrap-icons';
import Dashboard from './Dashboard';
import "./Lists.css"

function TodoList({ authUser }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [variants, setVariants] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [listData, setListData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditing } = location.state || {};
  const currentListData = location.state ? location.state.listData : null;

  // Initialize showTitleDescriptionFields based on isEditing
  const [showTitleDescriptionFields, setShowTitleDescriptionFields] = useState(
    isEditing || (currentListData && currentListData.title && currentListData.description)
  );

  useEffect(() => {
    const initialQuantities = currentListData ? currentListData.todos.map((todo) => todo.quantity) : [];

    if (currentListData) {
      setTodos(currentListData.todos.map((todo) => todo.text));
      setQuantities(initialQuantities);
      setListData(currentListData);
    }
  }, [currentListData]);

  // Initialize title and description with original values when in edit mode
  useEffect(() => {
    if (isEditing && currentListData) {
      setTitle(currentListData.title);
      setDescription(currentListData.description);
    }
  }, [isEditing, currentListData]);

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleSave = async () => {
    try {
      if (listData) {
        const listDocRef = doc(firestore, 'lists', listData.id);
        const updatedTodos = todos.map((todo, index) => ({
          text: todo,
          completed: false,
          quantity: quantities[index] || 0,
        }));

        // Use the current values or original values based on isEditing
        const updatedTitle = isEditing ? title : currentListData.title;
        const updatedDescription = isEditing ? description : currentListData.description;

        await updateDoc(listDocRef, { todos: updatedTodos, title: updatedTitle, description: updatedDescription });
        console.log('List updated in Firestore!');
      } else {
        const listRef = collection(firestore, 'lists');
        const newTodosWithCompleted = todos.map((todo, index) => ({
          text: todo,
          completed: false,
          quantity: quantities[index] || 0,
        }));
        await addDoc(listRef, {
          userId: authUser.uid,
          todos: newTodosWithCompleted,
          title,
          description,
        });

        console.log('List saved to Firestore!');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving/updating list in Firestore:', error);
    }

    setShowTitleDescriptionFields(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTodos = selectedOptions.map((option) => option.label);
    setTodos([...todos, ...newTodos]);
    setSelectedOptions([]);
    setQuantities([...quantities, ...new Array(newTodos.length).fill(0)]);

    // Show title and description fields when adding todos
    setShowTitleDescriptionFields(true);
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
    <div className="list-parent-div">
      <div className="jsx_wrapper_div">
        <h1 className="form_header_h1">Create a Todo List</h1>
        <form className='lists-form' onSubmit={handleSubmit}>
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
        {showTitleDescriptionFields && (
          <div>
            <input
              type="text"
              placeholder="Name of Build..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        )}
        <ul className="todo_item_list">
          {todos.map((todo, index) => (
            <li className="todo_item" key={index}>
              <input
                className="quantity-input-lists"
                type="number"
                value={quantities[index] || ''}
                min="0"
                onChange={(e) => handleQuantityChange(index, e.target.value)}
              />
              {todo}{' '}
              <Trash
                className="trash-icon"
                onClick={() => handleDelete(index)}
              />
            </li>
          ))}
        </ul>
        {showTitleDescriptionFields && (
          <div>
            <textarea
              placeholder="Coordinates, Notes, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}
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
