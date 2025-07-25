import React, { useState } from "react";
import axios from "axios";
import "./TaskForm.css" // Make sure your CSS file is correctly imported.
import {
  FaPlusCircle,
  FaTrashAlt,
  FaTasks,
  FaStickyNote,
  FaExclamationCircle,
  FaCalendarAlt,
} from "react-icons/fa";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const API_URL =
    "https://2a361bfc-2f48-42b0-8ad6-5d8d8fec30e4-00-3sdsdmlcu7b3u.sisko.replit.dev/api/tasks";

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Task title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      await axios.post(API_URL, taskData);

      // Reset Form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setErrors({});

      // Success Message
      const successMessage = document.createElement("div");
      successMessage.className =
        "alert alert-success alert-dismissible fade show task-success-alert";
      successMessage.innerHTML = `
        <strong> Success!</strong> Task "${taskData.title}" has been added successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.querySelector(".card-body")?.prepend(successMessage);
      setTimeout(() => {
        successMessage.remove();
      }, 3000);

      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      console.error(" Add Error:", err.message);
      setErrors({ submit: "Failed to add task. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "high":
        return "#ff6b35";
      case "urgent":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 task-form">
      {/* Task Title & Description Section with Slide-in animations */}
      <div className="row">
        {/* Task Title */}
        <div className="col-md-6 task-form-group slide-in-left" style={{ animationDelay: '0.1s' }}> {/* Added slide-in-left and delay */}
          <label htmlFor="taskTitle" className="form-label">
            <span className="task-form-icon-circle">
              <FaTasks />
            </span>
            Task Title *
          </label>
          <input
            id="taskTitle"
            type="text"
            className={`form-control ${
              errors.title ? "is-invalid" : title ? "is-valid" : ""
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your task title..."
            maxLength="100"
            disabled={isSubmitting}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          <div className="form-text">{title.length}/100 characters</div>
        </div>

        {/* Description */}
        <div className="col-md-6 task-form-group slide-in-right" style={{ animationDelay: '0.2s' }}> {/* Added slide-in-right and delay */}
          <label htmlFor="taskDescription" className="form-label">
            <span className="task-form-icon-circle">
              <FaStickyNote />
            </span>
            Description *
          </label>
          <textarea
            id="taskDescription"
            className={`form-control ${
              errors.description ? "is-invalid" : description ? "is-valid" : ""
            }`}
            rows="6"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your task in detail..."
            maxLength="500"
            disabled={isSubmitting}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
          <div className="form-text">{description.length}/500 characters</div>
        </div>
      </div>

      {/* Priority & Due Date Section with Slide-in and staggered animation */}
      <div className="row"> {/* Removed fade-in from this row to rely on individual column animations */}
        {/* Priority Selector */}
        <div className="col-md-6 task-form-group slide-in-left" style={{ animationDelay: '0.3s' }}> {/* Added slide-in-left and delay */}
          <label htmlFor="taskPriority" className="form-label">
            <span className="task-form-icon-circle">
              <FaExclamationCircle />
            </span>
            Priority
          </label>
          <select
            id="taskPriority"
            className="form-select shadow-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
          <div className="form-text mt-2">
            <span
              className="badge rounded-pill px-3 py-1"
              style={{
                backgroundColor: getPriorityColor(priority),
                color: "#fff",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </span>
          </div>
        </div>

        {/* Due Date Picker */}
        <div className="col-md-6 task-form-group slide-in-right" style={{ animationDelay: '0.4s' }}> {/* Added slide-in-right and delay */}
          <label htmlFor="taskDueDate" className="form-label">
            <span className="task-form-icon-circle">
              <FaCalendarAlt />
            </span>
            Due Date
          </label>
          <input
            id="taskDueDate"
            type="date"
            className="form-control shadow-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            disabled={isSubmitting}
          />
          <div className="form-text mt-2 text-muted">
            Optional deadline for this task
          </div>
        </div>
      </div>

      {/* Action Buttons Section with Fade-in and delayed animation */}
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4 fade-in" style={{ animationDelay: '0.5s' }}> {/* Added animationDelay */}
        <button
          type="submit"
          className="btn-orange"
          disabled={isSubmitting || !title.trim() || !description.trim()}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status"></span>
              Adding...
            </>
          ) : (
            <>
              <FaPlusCircle /> Add New Task
            </>
          )}
        </button>

        {(title || description) && (
          <button
            type="button"
            className="btn-orange-outline"
            onClick={() => {
              setTitle("");
              setDescription("");
              setPriority("medium");
              setDueDate("");
              setErrors({});
            }}
            disabled={isSubmitting}
          >
            <FaTrashAlt /> Clear Form
          </button>
        )}
      </div>

      {/* Submission Error (can also have a fade-in if desired) */}
      {errors.submit && (
        <div className="alert alert-danger mt-3 text-center fade-in" style={{ animationDelay: '0.6s' }} role="alert">
          {errors.submit}
        </div>
      )}
    </form>
  );
};

export default TaskForm;