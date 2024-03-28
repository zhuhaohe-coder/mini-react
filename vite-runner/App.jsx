import React from "./core/React.js";

let showBar = false;
// function Foo() {
//   return (
//     <div>
//       foo
//       <div>child</div>
//     </div>
//   );
// }
function Counter() {
  const foo = (
    <div>
      foo
      <div>child1</div>
      <div>child2</div>
    </div>
  );
  const bar = <div>bar</div>;

  function handleShowBar() {
    showBar = !showBar;
    React.update();
  }

  return (
    <div>
      Counter
      {/* <div>{showBar ? bar : <Foo />}</div> */}
      <div>{showBar ? bar : foo}</div>
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
