import React from "./core/React.js";
import ReactDOM from "./core/ReactDOM.js";
const el = React.createElement(
  "div",
  { className: "app" },
  "hi",
  "-",
  "mini-react"
);

ReactDOM.createRoot(document.querySelector("#root")).render(el);
