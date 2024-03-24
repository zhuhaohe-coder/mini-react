let taskId = 0;
function workLoop(deadline) {
  taskId++;
  let shouldYield = false;
  while (!shouldYield) {
    if (deadline.timeRemaining() < 0) {
      shouldYield = true;
    }
    console.log(`run task${taskId}`);
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
