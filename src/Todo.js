import React, { useState } from 'react';
import Select from 'react-select';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'todo1', label: 'Todo 1' },
    { value: 'todo2', label: 'Todo 2' },
    { value: 'todo3', label: 'Todo 3' },
    { value: 'todo4', label: 'Todo 4' }
  ];

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

  return (
    <div>
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
        <button>Add Todo</button>
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