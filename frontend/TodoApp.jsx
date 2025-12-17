import { useState, useEffect, useContext } from "react";
import API from "./api.js";
import { Plus, Trash2, CheckCircle, Edit2, Save, X } from "lucide-react";


export default function TodoApp() {
  
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;
    try {
      console.log("Adding task:", input);
      const res = await API.post("/tasks", { text: input });
      console.log("Task added:", res.data);
      setTasks([...tasks, res.data]);
      setInput("");
    } catch (err) {
      console.error("Failed to add task:", err.response?.data || err.message);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await API.patch(`/tasks/${id}`);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.text);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await API.put(`/tasks/${id}`, { text: editText });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("Failed to edit task:", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1"
          >
            <Plus size={18} /> Add
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {tasks.length === 0 && (
            <p className="text-gray-500 text-center">No tasks yet 🎉</p>
          )}
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg shadow-sm"
            >
              {editingId === task._id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border rounded px-2 py-1"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(task._id)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    onClick={() => toggleTask(task._id)}
                    className={`flex items-center gap-2 cursor-pointer ${
                      task.done ? "line-through text-gray-400" : ""
                    }`}
                  >
                    <CheckCircle
                      size={20}
                      className={task.done ? "text-green-500" : "text-gray-400"}
                    />
                    {task.text}
                  </span>
                  <div className="flex gap-2">
                    {!task.done && (
                      <button
                        onClick={() => startEdit(task)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
