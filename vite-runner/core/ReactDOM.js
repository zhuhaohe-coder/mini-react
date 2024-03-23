import React from "./React.js";

export default {
  createRoot(container) {
    return {
      render(el) {
        React.render(el, container);
      },
    };
  },
};
