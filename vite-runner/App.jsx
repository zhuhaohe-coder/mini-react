import React from "./core/React.js";

function App() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");

  function handleClick() {
    setCount((count) => count + 1);
    setBar("bar");
  }

  React.useEffect(() => {
    console.log("init");
    return () => {
      console.log("cleanup 0");
    };
  }, []);

  React.useEffect(() => {
    console.log("update", count);
    return () => {
      console.log("cleanup 1");
    };
  }, [count]);

  React.useEffect(() => {
    console.log("update", count);
    return () => {
      console.log("cleanup 2");
    };
  }, [count]);
  return (
    <div>
      <div>count:{count}</div>
      <div>bar:{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  );
}

export default App;
