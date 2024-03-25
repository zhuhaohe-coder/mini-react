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

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = props[prop];
    }
  });
}

function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = child;
  });
}

let nextWorkOfUnit = null;
function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    // fiber.parent.dom.append(dom);

    updateProps(dom, fiber.props);
  }

  //转换链表
  initChildren(fiber);

  //返回下一个任务 :1.child 2.sibling 3.parent.sibling
  return fiber.child
    ? fiber.child
    : fiber.sibling
    ? fiber.sibling
    : fiber.parent.sibling
    ? fiber.parent.sibling
    : null;
}
let root = null;
function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextWorkOfUnit;
}

function commitRoot() {
  commitWork(root.child);
}

function commitWork(fiber) {
  if (!fiber) return;
  fiber.parent.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    shouldYield = deadline.timeRemaining() < 1;
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
  }

  if (!nextWorkOfUnit && root) {
    commitRoot();
    root = null;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

export default {
  render,
  createElement,
};
