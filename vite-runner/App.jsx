import React from "./core/React.js";

function App() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");

  function handleClick() {
    setCount((count) => count + 1);
    setBar("bar");
  }
  return (
    <div>
      <div>count:{count}</div>
      <div>bar:{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  );
}

export default App;
