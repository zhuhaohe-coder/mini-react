import React from "./core/React.js";

let showBar = false;
function Foo() {
  return <p>foo</p>;
}
function Counter() {
  const bar = <p>bar</p>;

  function handleShowBar() {
    showBar = !showBar;
    React.update();
  }

  return (
    <div>
      Counter
      <div>{showBar ? bar : <Foo />}</div>
      <button onClick={handleShowBar} showBar>
        showBar
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      hello-mini-react
      <Counter />
    </div>
  );
}

export default App;
