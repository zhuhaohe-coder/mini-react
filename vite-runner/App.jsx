import React from "./core/React.js";

function Counter({ num }) {
  const handleClick = () => {
    console.log("click");
  };
  return (
    <div className="counter">
      Count:{num}
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
