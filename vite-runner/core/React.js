function createTextNode(nodeValue) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  };
}

function render(el, container) {
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode(el.nodeValue)
      : document.createElement(el.type);

  Object.keys(el.props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = el.props[prop];
    }
  });

  el.props.children.forEach((child) => {
    render(child, dom);
  });

  container.append(dom);
}
export default {
  render,
  createElement,
};
