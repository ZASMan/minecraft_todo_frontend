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

  const [variants, setVariants] = useState([]);

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
    </div>
  );
}

export default TodoList;