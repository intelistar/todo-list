import React from "react";
import "./Menu.css";

function Menu({ sorting, filterOn, OnChangeSortOrder, OnChangeFilter }) {
  return (
    <div>
      <div id="sort">
        <button
          onClick={(e) => OnChangeSortOrder(e)}
          id={sorting === "Newest First" ? "selected" : ""}
          className="sort-bl"
        >
          Newest First
        </button>
        <button
          onClick={(e) => OnChangeSortOrder(e)}
          id={sorting === "Oldest First" ? "selected" : ""}
          className="sort-bl"
        >
          Oldest First
        </button>
        <button
          onClick={(e) => OnChangeSortOrder(e)}
          id={sorting === "In alphabet order" ? "selected" : ""}
          className="sort-bl"
        >
          In alphabet order
        </button>
      </div>
      <div id="filter">
        <span>FILTER:</span>
        <div>
          <input
            type="checkbox"
            checked={filterOn}
            onChange={(e) => OnChangeFilter(e)}
          />
          <span>only unfulfilled</span>
        </div>
      </div>
    </div>
  );
}
export default React.memo(Menu);
