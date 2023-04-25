import './Lists.css';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
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

const [options, setOptions] = useState([]);

useEffect(() => {
  axios.get('http://localhost:9292/v1/minecraft_items/variants')
    .then(response => {
      const options = Object.values(response.data).map(variant => ({
        value: variant.id,
        label: variant.name
      }));
      setOptions(options);
    })
    .catch(error => {
      console.log(error);
    });
}, []);

  return (
    <div className="jsx_wrapper_div">
      <h1 className="form_header_h1">Pick some items for your build</h1>
      <form onSubmit={handleSubmit}>
        <Select
          isMulti
          options={options}
          value={selectedOptions}
          onChange={handleSelectChange}
          placeholder="Select todos..."
          isSearchable
          closeMenuOnSelect={false}
        />
        <button className="add_button">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}{' '}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;