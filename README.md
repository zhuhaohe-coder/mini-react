# Day 01

> 目标: 在页面中呈现app(使用React的API)

效果如下:

```js
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
ReactDoM.createRoot(document.getElementById( "root")).render(<App />)
```

## 步骤



1. 动态创建虚拟dom (注意虚拟dom的形式,要符合jsx的规范)
2. 创建渲染函数
3. 重构API
4. 使用jsx代替掉js写法
5. 借助vite实现jsx的解析

## 重点



vite解析jsx的时,会调用React.createElement函数。这也是为什么我们平时在项目中并没有使用React确需要引入的原因

```js
import React from "./core/React.js";
function Test() {
	return <div id="test">test</div>;
}
console.log(Test);

//	ƒ Test() {
//  	return /* @__PURE__ */ React.createElement("div", { id: "test" }, "test");
//	}
```

# Day 02

> 目标: 实现任务调度器&fiber架构

## requestIdleCallback

> requestIdleCallback(callback[, options])

`callback` 是需要执行的任务，接收一个 **IdleDeadline** ==对象==作为参数。**IdleDeadline** 包含 2 个重要字段

1. **didTimeout**，布尔值，表示任务是否超时
2. **timeRemaining()** ，用于获取当前帧的剩余时间

`options` 是一个可选参数，目前只有一个值 `timeout`，表示如果超过这个时间，任务还没有执行，则强制执行任务，不需要等待空闲时间。

## 实现fiber架构

> 解决思路: 把树结构转变成链表结构  (边转换为链表边渲染)

1. child 
2. sibling 
3. parent 的 sibling

### 步骤

performWorkOfUnit 

1. 创建dom
2. 添加dom
3. 处理props
4. 转换链表 设置好指针
5. 返回下一个要执行的workUnit

在render时设置好初始的workUnit

```js
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
```

# Day 03

## 实现统一提交

存在问题: 中途可能无空余时间, 用户会看到渲染一半的dom

解决思路: 计算结束后统一添加到屏幕里

关键点:

1. 何时处理完链表 ? `nextWorkOfUnit===null`
2. 根结点 ? render中初始化的 `nextWorkOfUnit`

## 实现 function component

- fiber的type若为function需要调用一下,传入props
- 处理children的格式
- 递归寻找有dom的父节点
- 更改文本节点的判断,添加number类型
- 更改寻找叔叔节点的逻辑

