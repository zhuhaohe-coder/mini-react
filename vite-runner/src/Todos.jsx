import React from "../core/React.js";
export default function Todos() {
  const [filter, setFilter] = React.useState("all");
  const [inputValue, setInputValue] = React.useState("");
  const [todoList, setTodoList] = React.useState([]);
  const [displayTodos, setDisplayTodos] = React.useState([]);

  function handleAdd() {
    setTodoList((todoList) => [
      ...todoList,
      { title: inputValue, done: false, id: crypto.randomUUID() },
    ]);
    setInputValue("");
  }
  function removeTodo(id) {
    setTodoList((todoList) => todoList.filter((todo) => todo.id !== id));
  }

  function doneTodo(id) {
    setTodoList((todoList) =>
      todoList.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }

  function saveTodo() {
    localStorage.setItem("todo", JSON.stringify(todoList));
  }

  React.useEffect(() => {
    setTodoList(
      localStorage.getItem("todo")
        ? JSON.parse(localStorage.getItem("todo"))
        : []
    );
  }, []);

  React.useEffect(() => {
    if (filter === "all") setDisplayTodos(todoList);
    else if (filter === "active")
      setDisplayTodos(todoList.filter((todo) => !todo.done));
    else if (filter === "done")
      setDisplayTodos(todoList.filter((todo) => todo.done));
  }, [filter, todoList]);

  return (
    <div>
      <h1>TODOS</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleAdd}>add</button>
      </div>
      <div>
        <button onClick={saveTodo}>save</button>
      </div>
      <div>
        <input
          type="radio"
          id="all"
          value="all"
          checked={filter === "all"}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
        <label htmlFor="all">all</label>

        <input
          type="radio"
          id="done"
          value="done"
          checked={filter === "done"}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
        <label htmlFor="done">done</label>

        <input
          type="radio"
          id="active"
          value="active"
          checked={filter === "active"}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
        <label htmlFor="active">active</label>
      </div>

      <ul>
        {...displayTodos.map((todo) => {
          return (
            <TodoItem todo={todo} removeTodo={removeTodo} doneTodo={doneTodo} />
          );
        })}
      </ul>
    </div>
  );
}

function TodoItem({ todo, removeTodo, doneTodo }) {
  return (
    <li>
      <span>{todo.done ? <del>{todo.title}</del> : todo.title}</span>
      <button onClick={() => doneTodo(todo.id)}>
        {todo.done ? "cancel" : "done"}
      </button>
      <button onClick={() => removeTodo(todo.id)}>remove</button>
    </li>
  );
}
