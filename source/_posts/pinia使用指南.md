---
title: pinia使用指南
date: 2023-05-27 10:37:37
tags: [vue3.0,pinia]
keywords: pinia使用指南
---
Pinia 是 Vue 的专属状态管理库，Vue3官网推荐使用Pinia，Pinia支持Vue2和Vue3。
<!--more-->
**Pinia** 对比 **vuex** 
  - 没有了 **mutations** 这个概念只需要用 Action就可以定义同步和异步的方法
  - 没有了 **modules** Pinia里每个store是一个模块
  - 轻量化 Pinia 大小只有 1kb 左右！

<!--more-->

# 起步
安装 pinia
```
yarn add pinia
# 或者使用 npm
npm install pinia
```
Vue3使用
```
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```
# Store 
**defineStore**来定义Store，每个store是一个模块

```
import { defineStore } from 'pinia'

const countStore = defineStore('storeId', {
  state: () => {
    return {
      count: 0,
    }
  },
})

export { countStore };

```
**使用state**

```
const store = countStore()
// 可以通过 store 实例访问 state，直接对其进行读写
store.count++

// 重置 state
store.$reset()

// 变更 state 除了用 store.count++ 直接改变 store，你还可以调用 $patch 方法。它允许你用一个 state 的补丁对象在同一时间更改多个属性
store.$patch({
  count: store.count + 1,
  age: 120
})

// 订阅 state
store.$subscribe((mutation, state) => {
  // mutation.type // ‘direct’ | ‘patch object’ | ‘patch function’
  // mutation.storeId // 'storeId'
  console.log(mutation, state);
}, { detached: true });
```
订阅**$subscribe**
 - mutation.type  
    - **direct**  直接修改值
    - **patch object** 通过 patch 传对象方式修改
    - **patch function** 通过 patch 函数形式修改值
 - detached: true 订阅器即便在组件卸载之后仍会被保留

注: ``store.$state = { count: 24 }`` 不能完全替换掉 store 的 state，因为那样会破坏其响应性。要使用$patch来修改。

# Getter
Getter 完全等同于 store 的 state 的计算值。可以通过 defineStore() 中的 **getters** 属性来定义它们。
```
const countStore = defineStore('storeId', {
  state: () => {
    return {
      count: 0,
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
})
```
使用和state一样。Getter也可以不依赖于state，可以使用其他 getter 来计算。

# Action
Action 相当于组件中的 method。它们可以通过 defineStore() 中的 actions 属性来定义。
```
const countStore = defineStore('storeId', {
  state: () => {
    return {
      count: 0,
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  }
})

const store = countStore()
// 直接使用actions
store.increment()
```
Action 里面不同区分同步还是异步，比vuex更简单和使用方便。

** 订阅 action ** 通过 store.$onAction(callback, false) 来监听 action 和它们的结果。传递给它的回调函数会在 action 本身之前执行。after 表示在 promise 解决之后，允许你在 action 解决后执行一个回调函数。同样地，onError 允许你在 action 抛出错误或 reject 时执行一个回调函数。**组件销毁会自动删除action 订阅器，如需保留可以传递第二个参数 true**。
```
const store = countStore()
const unsubscribe = store.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `countStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
     // 为这个特定的 action 调用提供一个共享变量
    const startTime = Date.now()
    // 这将在执行 "store "的 action 之前触发。
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果 action 抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听器
unsubscribe()
```
# 访问其他 store 的 Store、 getter、 Action
Pinia里每个store是一个模块，直接import 实例化 就可以使用其他store 的 Store、 getter、 Action。
```
export const ageStore = defineStore("ageStore", {
  state: () => {
    return {
      age: 18
    };
  },
  getters: {
    doubleAge: (state) => state.age * 2
  },
  actions: {
    increment() {
      this.age++;
    }
  }
});

// 引入 ageStore 并使用ageStore 的 Store、 getter、 Action
import { ageStore } from "./age";
const countStore = defineStore("storeId", {
  state: () => {
    // 使用 ageStore 的 state
    const age = ageStore();
    return {
      count: 0,
      age: age.age
    };
  },
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      // 使用 ageStore 的 actions
      const age = ageStore();
      age.increment();
      this.count++;
    }
  }
});

export { countStore };

```
注: 两个或更多的 store 相互使用，它们不可以通过 getters 或 actions 创建一个无限循环。它们也不可以同时在它们的 setup 函数中直接互相读取对方的 state

# 组合式API写法
```
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```
在 Setup Store 中：
   - ref() 就是 state 属性
   - computed() 就是 getters
   - function() 就是 actions
# demo 
[demo](https://codesandbox.io/s/nameless-dawn-19ol4w?file=/src/store/count.js:0-483)

# 参考
[pinia](https://pinia.vuejs.org/zh/)