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

# Day 04 

## 实现事件绑定

在处理props时拦截"on"开头的prop,并添加对应事件

## 实现更新props

核心: 对比新旧两颗dom树

问题:

1. 如何得到新的dom树

   render函数构建dom树 ---> update函数

   定义currentRoot, 在重置root前赋值

2. 如何找到老的节点

   新节点创建一个属性alternate指向老的节点

   initChildren时判断是更新/创建, 添加一个新属性effectTag(update/placement)

   更新是不会创建dom的,直接用老的dom

   绑定alternate

   多个子节点需要更新oldFiber = oldFiber.sibling

   在commitWork中判断更新还是插入

3. 如何 diff props

   updateProps(dom,nextProps,prevProps);

   1. old有 new没有  删除 removeAttribute
   2. new有 old无 添加
   3. new有 old有 修改
   4. 删除之前的回调

# Day 05

## diff-更新children

核心: type不一致 删除旧的 创建新的

在`reconcileChildren` 中判断了fiber的type是否一致,得到需要删除的fiber

设置一个数组存储需要删除的fiber 在`commitRoot`阶段删除

Function Component需要进行特殊处理 fiber要有dom, fiber.parent也要有dom

删除完后需将数组置空

## diff-删除多余的老节点

新的比老的短,多出来的节点需要删掉

多出来的节点为oldFiber.sibling

## 支持&&操作符

在创建newFiber前做判断来筛除 false 的情况,同时在创建完newFiber后再去更新保存的prevChild

## 优化更新 减少不必要的计算

问题: 更新子组件时, 其它不相关的组件也会重新执行 造成了浪费

开始节点: 当前要更新的FC

结束节点: 处理兄弟节点时

使用闭包存储真正需要更新的Fiber

# Day 06

## 实现UseState

在setState中执行更新逻辑

为currentFiber添加stateHook属性, 用来保存上一次更新后state的值

当处理多个state时会出现混乱, 使用数组和索引去解决

updateFunctionComponent时重置数组和索引

## 批量执行action

将action存储在queue中, 下次执行时统一执行

## 提前检测 减少不必要的更新

提前判断action的值与当前state是否一样

# Day 07

> useEffect的调用时机:  React完成对DOM的渲染之后，并且浏览器完成绘制之前

## 实现useEffect

调用时机：commitWork之后

保存Callback和deps

从根结点一次递归，执行节点上的effecthook

初始化时直接执行，更新时需要检测依赖项是否发生改变（通过判断alternate的deps和当前deps是否相同）

支持多个useEffect也是使用数组存储

## 实现cleanup

deps为空时，cleanup不会执行

在执行Callback时为cleanup赋值

执行effct前遍历（遍历的是之前的effectHook）执行cleanup
