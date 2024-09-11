import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { Trash } from 'react-bootstrap-icons';
import axios from 'axios';

function EditList({ authUser }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [initialState, setInitialState] = useState({});
  const navigate = useNavigate();
  const { listId } = useParams();

  // Fetch the list from Firestore on component mount
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

          // Save the initial state for comparison
          setInitialState({
            title: listData.title,
            description: listData.description,
            todos: listData.todos.map((todo) => todo.text),
            quantities: listData.todos.map((todo) => todo.quantity || 0),
          });
        }
      } catch (error) {
        console.error('Error fetching list from Firestore:', error);
      }
    };

    fetchList();
  }, [listId]);

  // Fetch available item variants
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

  // Handle changes for the todos and quantities
  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = parseInt(value, 10);
    setQuantities(newQuantities);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTodos = selectedOptions.map((option) => option.label);
    setTodos([...todos, ...newTodos]);
    setSelectedOptions([]);
    setQuantities([...quantities, ...new Array(newTodos.length).fill(0)]);
  };

  const handleDelete = (index) => {
    const newTodos = [...todos];
    const newQuantities = [...quantities];
    newTodos.splice(index, 1);
    newQuantities.splice(index, 1);
    setTodos(newTodos);
    setQuantities(newQuantities);
  };

  // Check if changes are made by comparing current state with the initial state
  const hasChanges = () => {
    return (
      title !== initialState.title ||
      description !== initialState.description ||
      JSON.stringify(todos) !== JSON.stringify(initialState.todos) ||
      JSON.stringify(quantities) !== JSON.stringify(initialState.quantities)
    );
  };

  // Save the updated list to Firestore
  const handleSave = async () => {
    try {
      const listDocRef = doc(firestore, 'lists', listId);
      const newTodosWithCompleted = todos.map((todo, index) => ({
        text: todo,
        completed: false,
        quantity: quantities[index] || 0,
      }));

      await updateDoc(listDocRef, {
        title,
        description,
        todos: newTodosWithCompleted,
      });

      console.log('List updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating list in Firestore:', error);
    }
  };

  // Cancel the edit and go back to the previous page
  const handleCancel = () => {
    navigate('/dashboard'); // Navigate back to the dashboard or previous page
  };

  return (
    <div className="background_img">
      <div className="jsx_wrapper_div">
        <h1 className="form_header_h1">Edit Your List</h1>
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

        <div className="button-group">
          <Button
            className="save_button"
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges()} // Disable if no changes are made
          >
            Save
          </Button><Button
            className="cancel_button"
            variant="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditList;
