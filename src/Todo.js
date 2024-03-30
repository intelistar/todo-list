import React from "react";
import "./Todo.css";

function Todo({ todo: { name, done, id, date }, onDone, onDelete }) {
  console.log(name);
  return (
    <div className={`todo ${done ? "completed" : ""}`}>
      <div className="task">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => onDone(e.target.checked, id)}
          className="checkbox"
        />
        <span>{name}</span>
      </div>
      <div className="date">{date}</div>
      <button className="delete" onClick={() => onDelete(id)}>
        Delete
      </button>
    </div>
  );
}

export default React.memo(Todo);
