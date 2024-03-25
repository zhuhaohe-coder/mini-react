import React from "./core/React.js";

function Counter({ num }) {
  return <div className="counter">Count:{num}</div>;
}
function CounterContainer() {
  return (
    <div>
      <Counter num={10} />
      <Counter num={20} />
    </div>
  );
}

const App = (
  <div className="app">
    hello-mini-react
    <CounterContainer />
  </div>
);

export default App;
