let nextWorkOfUnit = null;
//work in progress
let wipRoot = null;
let currentRoot = null;
let deletions = [];
let wibFiber = null;
let stateHooks = [];
let stateHookIndex = 0;

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
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
  //1.old有 new无 ---> 删除
  Object.keys(prevProps).forEach((prop) => {
    if (prop !== "children") {
      if (!(prop in nextProps)) {
        dom.removeAttribute(prop);
      }
    }
  });
  //2.old无 new有/old有 new有 ---> 添加/更新
  Object.keys(nextProps).forEach((prop) => {
    if (prop !== "children") {
      if (nextProps[prop] !== prevProps[prop]) {
        if (prop.startsWith("on")) {
          const eventType = prop.slice(2).toLocaleLowerCase();
          dom.removeEventListener(eventType, prevProps[prop]);
          dom.addEventListener(eventType, nextProps[prop]);
        } else {
          dom[prop] = nextProps[prop];
        }
      }
    }
  });
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;
    let newFiber = null;
    if (isSameType) {
      //update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        //更新不会新建dom
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      };
    } else {
      //create
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: "placement",
        };
      }

      if (oldFiber) deletions.push(oldFiber);
    }
    // 第n个(n>=2)子节点需要用上一个子节点的sibling去指向
    if (oldFiber) oldFiber = oldFiber.sibling;
    // 删除多余旧节点
    while (oldFiber) {
      deletions.push(oldFiber);
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    if (newFiber) prevChild = newFiber;
  });
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
  stateHooks = [];
  stateHookIndex = 0;
  wibFiber = fiber;
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (!isFunctionComponent) {
    updateHostComponent(fiber);
  } else {
    updateFunctionComponent(fiber);
  }

  //返回下一个任务 :1.child 2.sibling 3.parent.sibling
  if (fiber.child) {
    return fiber.child;
  }

  if (fiber.sibling) {
    return fiber.sibling;
  }

  let nextFiber = fiber.parent;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };
  nextWorkOfUnit = wipRoot;
}

function commitRoot() {
  deletions.forEach(commitDeletion);
  deletions = [];
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    shouldYield = deadline.timeRemaining() < 1;
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    if (nextWorkOfUnit?.type === wipRoot?.sibling?.type) {
      nextWorkOfUnit = undefined;
    }
  }

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

// function update() {
//   let currentFiber = wibFiber;
//   return () => {
//     console.log(currentFiber);
//     wipRoot = {
//       ...currentFiber,
//       alternate: currentFiber,
//     };
//     nextWorkOfUnit = wipRoot;
//   };
// }

function useState(initial) {
  let currentFiber = wibFiber;

  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex];

  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  };

  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state);
  });

  stateHook.queue = [];

  stateHooks.push(stateHook);
  stateHookIndex++;

  currentFiber.stateHooks = stateHooks;
  function setState(action) {
    const eagerState =
      typeof action === "function" ? action(stateHook.state) : action;

    if (eagerState === stateHook.state) return;

    stateHook.queue.push(typeof action === "function" ? action : () => action);
    // 执行更新逻辑
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    nextWorkOfUnit = wipRoot;
  }

  return [stateHook.state, setState];
}

requestIdleCallback(workLoop);

export default {
  render,
  createElement,
  // update,
  useState,
};
