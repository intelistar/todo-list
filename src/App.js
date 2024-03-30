import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import "./App.css";
import Todo from "./Todo";
import Menu from "./Menu";

const loadFromLocaleStorage = () => JSON.parse(localStorage.getItem("todos"));

const SORT_ORDER = {
  OLDEST_FIRST: "Oldest First",
  ALPHABET_ORDER: "In alphabet order",
  NEWEST_FIRST: "Newest First",
};
const ACTION_TYPES = {
  CHANGE_NAME: "CHANGE_NAME",
  DELETE_TODO: "DELETE_TODO",
  CHANGE_DONE: "CHANGE_DONE",
  ADD_TODO: "ADD_TODO",
  CHANGE_SORTING: "CHANGE_SORTING",
  CHANGE_FILTER: "CHANGE_FILTER",
};

const handleSortArray = (todos, order) => {
  switch (order) {
    case SORT_ORDER.OLDEST_FIRST:
      return [...todos].sort((a, b) => a.time - b.time);
    case SORT_ORDER.ALPHABET_ORDER:
      return [...todos].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return [...todos].sort((a, b) => b.time - a.time);
  }
};

const reducer = (state, { type, data }) => {
  switch (type) {
    case ACTION_TYPES.CHANGE_NAME:
      return { ...state, name: data };
    case ACTION_TYPES.DELETE_TODO:
      return { ...state, todos: state.todos.filter((t) => t.id !== data) };
    case ACTION_TYPES.CHANGE_DONE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === data.id ? { ...todo, done: data.done } : todo
        ),
      };
    case ACTION_TYPES.ADD_TODO: {
      if (!state.name || state.name.trim() === "") {
        return {
          ...state,
          name: "",
          error: "you can not add an empty task or task only from spaces",
        };
      }
      const todo = {
        name: state.name,
        done: false,
        id: Date.now(),
        date: data.toLocaleString(),
        time: data.getTime(),
      };
      return {
        ...state,
        name: "",
        error: "",
        todos: [todo, ...state.todos],
      };
    }
    case ACTION_TYPES.CHANGE_SORTING:
      return { ...state, sortOrder: data };
    case ACTION_TYPES.CHANGE_FILTER:
      return { ...state, showCompleted: data };
    default:
      return state;
  }
};

const DEFAULT_STATE = {
  name: "",
  todos: loadFromLocaleStorage() || [],
  error: "",
  sortOrder: SORT_ORDER.NEWEST_FIRST,
  showCompleted: false,
};

export default function App() {
  const [{ name, todos, error, sortOrder, showCompleted }, dispatch] =
    useReducer(reducer, DEFAULT_STATE);

  let dones = useMemo(() => todos.filter((t) => t.done).length, [todos]);

  const handleDispatch = (type, data) => dispatch({ type, data });

  const handleSetName = useCallback(
    (e) => handleDispatch(ACTION_TYPES.CHANGE_NAME, e.target.value),
    []
  );

  const handleDelete = useCallback(
    (id) => handleDispatch(ACTION_TYPES.DELETE_TODO, id),
    []
  );

  const handleSetDone = useCallback(
    (done, id) => handleDispatch(ACTION_TYPES.CHANGE_DONE, { done, id }),
    []
  );

  const handleAddTodo = useCallback((e) => {
    e.preventDefault();
    const currentDate = new Date();
    handleDispatch(ACTION_TYPES.ADD_TODO, currentDate);
  }, []);

  const handleFilterChange = (e) =>
    handleDispatch(ACTION_TYPES.CHANGE_FILTER, e.target.checked);

  const handleSortChange = (e) =>
    handleDispatch(ACTION_TYPES.CHANGE_SORTING, e.target.innerText);

  const todosToView = useMemo(() => {
    return handleSortArray(
      todos.filter((todo) => !showCompleted || !todo.done),
      sortOrder
    );
  }, [todos, sortOrder, showCompleted]);

  const saveToLocaleStorage = (todos) => {
    localStorage.setItem(
      "todos",
      JSON.stringify(handleSortArray(todos, SORT_ORDER.NEWEST_FIRST))
    );
  };

  useEffect(() => saveToLocaleStorage(todos), [todos]);

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
        filterOn={showCompleted}
        OnChangeSortOrder={handleSortChange}
        OnChangeFilter={handleFilterChange}
      />
      <div className="todos">
        {todosToView.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            onDone={handleSetDone}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
