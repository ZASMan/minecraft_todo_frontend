import './Lists.css';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [variants, setVariants] = useState([]);
  const navigate = useNavigate();

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleSave = () => {
    const listRef = firestore.collection('lists'); // Create a reference to the "lists" collection

    // Create a new document in the "lists" collection with the todos array as its data
    listRef
      .add({
        todos: todos,
      })
      .then(() => {
        console.log('List saved to Firestore!');
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error saving list to Firestore:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTodos = selectedOptions.map(option => option.label);
    setTodos([...todos, ...newTodos]);
    setSelectedOptions([]);
  };

  const handleDelete = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

   useEffect(() => {
    axios.get('http://localhost:9292/v1/minecraft_items/variants')
      .then(response => {
        const dataArr = response.data
        const dataArrParsed = JSON.parse(dataArr)
        setVariants(dataArrParsed.map(variant => ({ label: variant, value: variant })));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="jsx_wrapper_div">
      <h1 className="form_header_h1">Pick some items for your build</h1>
      <form onSubmit={handleSubmit}>
        <Select
          isMulti
          options={variants}
          value={selectedOptions}
          onChange={handleSelectChange}
          placeholder="Select some items..."
          isSearchable
          closeMenuOnSelect={false}
        />
        <button className="add_button">Add Todo</button>
      </form>
      <ul className="todo_item_list">
        {todos.map((todo, index) => (
          <li className="todo_item" key={index}>
            {todo}{' '}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button className="save_button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

export default TodoList;