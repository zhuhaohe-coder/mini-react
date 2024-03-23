# Day 01



## 目标: 在页面中呈现app(使用React的API)



效果如下:

```js
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
ReactDoM.createRoot(document.getElementById( "root")).render(<App >)
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

