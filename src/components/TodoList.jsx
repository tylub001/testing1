import { useState, useEffect } from "react";
import "./TodoList.css";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(""); // Error message state

  // Load saved tasks from localStorage when the app starts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // Function to save tasks to localStorage
  const saveTasks = (updatedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  // Function to validate inputs
  const validateTask = () => {
    const selectedYear = date ? new Date(date).getFullYear() : null;
   
    if (task.trim().length < 2) {
      setError("Task name must be at least 2 characters.");
      return false;
    }

    if (!selectedYear || selectedYear < 2025) {
      setError("Date must be in the year 2025 or later.");
      return false;
    }

    setError("");
    return true;
  };

  // Function to add task
  const addTask = () => {
    if (validateTask()) {
      const formattedDate = date ? new Date(date).toLocaleDateString("en-US") : ""; 
      const newTasks = [...tasks, { task, date: formattedDate, completed: false }];
      saveTasks(newTasks);
      setTask("");
      setDate("");
      setShowModal(false);
    }
  };

  // Function to toggle task completion
  const toggleCompletion = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updatedTasks);
  };

  // Function to delete a task
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    saveTasks(updatedTasks);
  };

  // Calculate completed tasks count
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="container">
      <h1 className="name">TaskFlow</h1>
      <h2 className="motto">Organize. Prioritize. Conquer.</h2>
      <button className="addTask-btn" onClick={() => setShowModal(true)}>
        Add Task
      </button>
      {showModal && (
        <div className={`modal ${showModal ? "show" : ""}`}>
          <div className="modal-content">
            <h2>Add Task</h2>
            {error && <p style={{ color: "purple" }}>{error}</p>}
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                addTask();
              }}
            >
              <input
                type="text"
                placeholder="Enter task here"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button className="submit-btn" type="submit">Save Task</button>
              <button className="cancel-btn" type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <h2
        className={completedCount === tasks.length ? "all-completed" : "" }
      >
        {completedCount === 0
          ? "No tasks completed"
          : completedCount === tasks.length
          ? "All tasks completed!"
          : `${completedCount} out of ${tasks.length} completed`}
      </h2>
      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleCompletion(index)}
            />
            <div className="task-container">
              <span className={`task-text ${t.completed ? "completed" : ""}`}>
                {t.task}
              </span>
              <span className="task-date">{t.date}</span>
            </div>
            <button className="delete-btn" onClick={() => deleteTask(index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
