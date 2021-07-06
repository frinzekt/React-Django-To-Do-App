import React, { useState, useEffect } from "react";
import "./App.css";

const BACKEND_API_URL = "http://127.0.0.1:8000/api";
const App = () => {

  // States
  const [todoList, setTodoList] = useState([]);
  const [activeItem, setActiveItem] = useState({
    id: null,
    title: "",
    completed: false,
  });
  const [editing, setIsEditing] = useState(false);

  // Don't mind this
  // just security stuff
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  //Reload the fetch tasks once upon loading
  useEffect(() => {
    fetchTasks(); // will run asynchronously in the background
  }, []);

  // READ OPERATION
  const fetchTasks = async () => {
    console.log("Fetching Data");
    const response = await fetch(`${BACKEND_API_URL}/task-list/`);
    const data = await response.json();
    setTodoList(data);
  };

  // FORM HANDLERS HERE
  const handleChange = (event) => {
    // Refreshes the state of the active item
    setActiveItem({ ...activeItem, title: event.target.value });
  };

  // CREATE/EDIT OPERATION
  const handleSubmit = async (event) => {
    // prevent page reloads
    event.preventDefault();

    // Dont mind this... security stuff
    const csrftoken = getCookie("csrftoken");

    let url = `${BACKEND_API_URL}/task-create/`;
    if (editing == true) {
      url = `${BACKEND_API_URL}/task-update/${activeItem.id}/`;
      setIsEditing(false);
    }

    // Performs the request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(activeItem),
    });

    // Refresh the tasks
    // Not the best way to do it (should use the returned data to append)
    await fetchTasks();

    // Sets no active item
    setActiveItem({
      id: null,
      title: "",
      completed: false,
    });
  };

  // EDIT FORM HANDLER
  const startEdit = (task) => {
    setActiveItem(task);
    setIsEditing(true);
  };

  // DELETE OPERATION
  const deleteItem = async (task) => {
    const csrftoken = getCookie("csrftoken");

    const response = await fetch(`${BACKEND_API_URL}/task-delete/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    });

    // Refresh the tasks
    // Not the best way to do it (should use the returned data to remove)
    await fetchTasks();
  };

  // EDIT OPERATION
  const strikeToggle = async (task) => {
    task.completed = !task.completed;
    const csrftoken = getCookie("csrftoken");

    const response = await fetch(`${BACKEND_API_URL}/task-update/${task.id}/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ completed: task.completed, title: task.title }),
    });

    // Refresh the tasks
    // Not the best way to do it (should use the returned data to edit)
    await fetchTasks();
  };

  return(
    <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={handleChange}
                    className="form-control"
                    id="title"
                    value={activeItem.title}
                    type="text"
                    name="title"
                    placeholder="Add task.."
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <input
                    id="submit"
                    className="btn btn-warning"
                    type="submit"
                    name="Add"
                  />
                </div>
              </div>
            </form>
          </div>

          <div id="list-wrapper">
            {todoList.map(function (task, index) {
              return (
                <div key={index} className="task-wrapper flex-wrapper">
                  <div
                    onClick={() =>strikeToggle(task)}
                    style={{ flex: 7 }}
                  >
                    {task.completed == false ? (
                      <span>{task.title}</span>
                    ) : (
                      <strike>{task.title}</strike>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() =>startEdit(task)}
                      className="btn btn-sm btn-outline-info"
                    >
                      Edit
                    </button>
                  </div>

                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() =>deleteItem(task)}
                      className="btn btn-sm btn-outline-dark delete"
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
  )
};

export default App;
