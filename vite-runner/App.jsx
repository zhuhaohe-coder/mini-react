import React from "./core/React.js";

let countFoo = 1;
function Foo() {
  console.log("foo render");
  const update = React.update();
  function handleClick() {
    countFoo++;
    update();
    // React.update();
  }
  return (
    <div>
      <h1>foo</h1>
      {countFoo}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let countBar = 1;
function Bar() {
  console.log("bar render");
  const update = React.update();
  function handleClick() {
    countBar++;
    update();
    // React.update();
  }
  return (
    <div>
      <h1>bar</h1>
      {countBar}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let countRoot = 1;
function App() {
  console.log("app render");
  const update = React.update();
  function handleClick() {
    countRoot++;
    update();
    // React.update();
  }
  return (
    <div>
      countRoot :{countRoot}
      <button onClick={handleClick}>click</button>
      <Foo />
      <Bar />
    </div>
  );
}

export default App;
