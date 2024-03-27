import React from "./core/React.js";

let count = 0;

let className = "app";

function Counter({ num }) {
  const handleClick = () => {
    console.log("click");
    count++;
    className = "123123";
    React.update();
  };
  return (
    <div className={className}>
      Count:{count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}
function CounterContainer() {
  return (
    <div>
      <Counter num={10} />
      {/* <Counter num={20} /> */}
    </div>
  );
}
function App() {
  return (
    <div className="app">
      hello-mini-react
      <CounterContainer />
    </div>
  );
}

export default App;
