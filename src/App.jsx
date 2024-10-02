import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  deleteTodo,
  fetchTodos,
  toggleCompleted,
  updateTodo,
} from "./redux/todo-slice";

function App() {
  const [editTodo, setEditTodo] = useState(null);
  const [newTodo, setNewTodo] = useState({ name: "", description: "" });

  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (newTodo.name && newTodo.description) {
      dispatch(addTodo(newTodo));
      setNewTodo({ name: "", description: "" });
    }
  };

  const handleEditTodo = (todo) => {
    setEditTodo(todo);
    setNewTodo({ name: todo.name, description: todo.description });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateTodo = () => {
    dispatch(updateTodo({ ...editTodo, ...newTodo }));
    setEditTodo(null);
    setNewTodo({ name: "", description: "" });
  };

  const handleDeleteTodo = (id) => {
    let isDeleted = confirm(
      `¿Estás seguro de eliminar la tarea con el id ${id}?`
    );

    if (isDeleted) {
      dispatch(deleteTodo(id));
    } else {
      return false;
    }
  };

  const handleToggleCompleted = (todo) => {
    dispatch(toggleCompleted(todo));
  };

  return (
    <>
      <div className="container">
        <h1>Todo List App</h1>
        <div className="todo-form">
          <input
            type="text"
            placeholder="Nombre de la Tarea"
            value={newTodo.name}
            onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
          />
          <textarea
            placeholder="Descripción"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
          ></textarea>
          <button onClick={editTodo ? handleUpdateTodo : handleAddTodo}>
            {editTodo ? "Actualizar Tarea" : "Agregar Tarea"}
          </button>
        </div>
        {loading ? <p>Cargando...</p> : null}
        {error ? <p>Error en la App 😵😵😵</p> : null}
        <h2>Lista de Tareas por Hacer</h2>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? "completed" : ""}>
              <div>
                <h3>{todo.name}</h3>
                <p>{todo.description}</p>
                <p>Creada: {new Date(todo.created_at).toLocaleDateString()}</p>
                <p>
                  Actualizada: {new Date(todo.updated_at).toLocaleDateString()}
                </p>
                <div className="actions">
                  <button onClick={() => handleToggleCompleted(todo)}>
                    {todo.completed ? "Desmarcar" : "Marcar"}
                  </button>
                  <button onClick={() => handleEditTodo(todo)}>Editar</button>
                  <button onClick={() => handleDeleteTodo(todo.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
