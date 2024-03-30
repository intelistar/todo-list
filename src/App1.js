import React, { useCallback, useState, useMemo, useEffect } from "react";
import "./App.css";
import Todo from "./Todo";
import Menu from "./Menu";

export default function App() {
  const [name, setName] = useState("");
  const handleSetName = useCallback((e) => setName(e.target.value), []);

  const loadFromLocaleStorage = () => {
    const todosStr = localStorage.getItem("todos");
    return JSON.parse(todosStr);
  };

  const [todos, setTodos] = useState(() => {
    return loadFromLocaleStorage() || [];
  });

  let dones = useMemo(() => todos.filter((t) => t.done).length, [todos.length]);

  const handleDelete = useCallback((id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }, []);

  const handleSetDone = useCallback((done, id) => {
    setTodos((currentTodos) => {
      const newTodos = currentTodos.map((todo) =>
        todo.id === id ? { ...todo, done } : todo
      );
      return newTodos;
    });
  }, []);

  const [error, setError] = useState("");
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!name || name.trim() === "") {
      setName("");
      setError("you can not add an empty task or task only from spaces");
      return;
    }
    const currentDate = new Date();
    const todo = {
      name: name.trim(),
      done: false,
      id: Date.now(),
      date: currentDate.toLocaleString(),
      time: currentDate.getTime(),
    };

    setName("");
    setTodos((currentTodos) =>
      handleSortArray([todo, ...currentTodos], sortOrder)
    );
    setError("");
  };

  const [isCompleted, setIsCompleted] = useState(false);
  const handleChangeIsCompleted = useCallback((e) => {
    setIsCompleted(e.target.checked);
  }, []);

  const [sortOrder, setSortOrder] = useState("First New");
  const handleChangeSortOrder = useCallback((e) => {
    setSortOrder(e.target.innerText);
    setTodos((curTodos) => handleSortArray(curTodos, e.target.innerText));
  }, []);

  const handleSortArray = (todos, order) => {
    switch (order) {
      case "First Old":
        return [...todos].sort((a, b) => a.time - b.time);
      case "In alphabet order":
        return [...todos].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...todos].sort((a, b) => b.time - a.time);
    }
  };

  const filteredTodos = todos.filter((todo) => !isCompleted || !todo.done);

  const saveToLocaleStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  useEffect(() => {
    saveToLocaleStorage(todos);
  }, [todos]);

  return (
    <div id="main">
      <h1>Todo List</h1>
      <div className="amount">
        <span>All:{todos.length}</span>
        <span>Done:{dones}</span>
        <span>Left:{todos.length - dones}</span>
      </div>
      <form className="input-bl">
        <input
          id="input-add"
          value={name}
          onChange={handleSetName}
          placeholder="Enter the task"
          autoComplete="off"
        />
        <button type="submit" className="add" onClick={handleAddTodo}>
          Add
        </button>
      </form>
      {error && <div id="error">{error}</div>}
      <Menu
        sorting={sortOrder}
        filterOn={isCompleted}
        changeSortOrder={handleChangeSortOrder}
        changeFilter={handleChangeIsCompleted}
      />
      <div className="todos">
        {filteredTodos.map((t) => (
          <Todo
            key={t.id}
            id={t.id}
            name={t.name}
            done={t.done}
            date={t.date}
            onDone={handleSetDone}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
