import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabase/supabaseClient.js";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch existing todos from Supabase on load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("TodoList").select("*");
    if (error) {
      console.log("Error fetching:", error);
    } else {
      setTodoList(data);
    }
  };
  const completeTask = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("TodoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);
    if (error) {
      console.log("error toggling task:", error);
    } else {
      const updatedTodoList = todoList?.map((todo) =>
        todo?.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(updatedTodoList);
    }
  };
  const deleteTask = async (id) => {
    const { data, error } = await supabase
      .from("TodoList")
      .delete()
      .eq("id", id);
    if (error) {
      console.log("error deleting task:", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo?.id !== id));
    }
  };
  const addTodo = async () => {
    if (!newTodo.trim()) {
      alert("Please enter a todo item.");
      return;
    }
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    };
    const { data, error } = await supabase
      .from("TodoList")
      .insert([newTodoData])
      .single();

    if (error) {
      console.log("Error adding todo", error);
    } else {
      setTodoList((prev) => [...prev, data]);
      setNewTodo("");
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div className="mb-4">
        <input
          onChange={(e) => setNewTodo(e.target.value)}
          value={newTodo}
          className="px-2 py-2 border rounded mr-2"
          type="text"
          placeholder="New Todo.."
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Todo Item
        </button>
      </div>
      <ul>
        {todoList?.map((todo) => (
          <li className="mb-2" key={todo?.id}>
            <p className="my-2">{todo?.name}</p>
            <button onClick={() => completeTask(todo?.id, todo?.isCompleted)}>
              {todo?.isCompleted ? "Undo" : "Complete Task"}
            </button>
            <button onClick={() => deleteTask(todo?.id)}>Delete Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
