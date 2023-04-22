---
title: Vue3组合式API(Composition API) 
date: 2023-04-22 11:36:22
tags: [vue3.0,组合式API]
---
**组合式 API (Composition API)** 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写 Vue 组件。组合式 API 是**Vue 3 及 Vue 2.7** 的内置功能。对于更老的 Vue 2 版本，可以使用官方维护的插件 **@vue/composition-api**。
<!--more-->
Vue3并没有强制必须要使用**组合式 API (Composition API)** 在Vue3中还是可以使用 **选项式（Options API）**的写法。
# 什么是组合式 API？
组合式 API (Composition API) 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写 Vue 组件。它是一个概括性的术语，涵盖了以下方面的 API：
- **响应式 API**：例如 **ref()** 和 **reactive()**，使我们可以直接创建响应式状态、计算属性和侦听器。

- **生命周期钩子**：例如 **onMounted()** 和 **onUnmounted()**，使我们可以在组件各个生命周期阶段添加逻辑。

- **依赖注入**：例如 **provide()** 和 **inject()**，使我们可以在使用响应式 API 时，利用 Vue 的依赖注入系统。

# 组合式 API优点
- 提高代码逻辑的可复用性
- 更灵活的代码组织

## 对比
### 选项式 API（Options API）
```
<script>
export default {
  props: ['msg'],
  data() {
    return {
      count: 0, // 逻辑1的数据
      name: 'langpz' // 逻辑2的数据
    }
  },
  methods: {
    onAdd() { // 逻辑1的⽅法
      this.count++
    },
    getCount() { // 逻辑2的⽅法
      this.count = Math.floor(Math.random() * 100)
    }
  },
  computed: {
    helloText() { // 逻辑2的计算属性
      return this.msg + ' ' + this.name
    }
  },
  watch: {
    count() { // 逻辑1的Watch
      console.log('count 变了')
    } 
  },
  created() {
    this.getCount() // 逻辑2的初始化操作
  }
}
</script>
```

### 组合式 API (Composition API)
```
<script setup>
import { ref, watch, computed, onMounted } from 'vue'
const props = defineProps(['msg'])
// 逻辑1的数据
let count = ref(0)
// 逻辑1的⽅法
const onAdd = () => count.value++
// 逻辑1的Watch
watch(count, (val, oldVal) => {
  console.log(`count 从${oldVal} 变成了 ${val}`)
})

// 逻辑2的⽅法
const getCount = () => count.value = Math.floor(Math.random() * 100)
// 逻辑2的初始化操作
onMounted(getCount)
// 逻辑2的数据
let name = ref('langpz')
// 逻辑2的计算属性
let helloText = computed(() => props.msg + ' ' +name.value)
</script>
```
通过上面的例子相同的业务逻辑，组合式 API 里面同一个逻辑关注点相关的代码被归为了一组：我们无需再为了一个逻辑关注点在不同的选项块间来回滚动切换。此外，我们现在可以很轻松地将这一组代码移动到一个外部文件中，不再需要为了抽象而重新组织代码，大大降低了重构成本，这在长期维护的大型项目中非常关键。

# &lt;script setup&gt;
在 setup() 函数中手动暴露大量的状态和方法非常繁琐。幸运的是，我们可以通过使用构建工具来简化该操作。当使用单文件组件（SFC）时，我们可以使用 **&lt;script setup>** 来大幅度地简化代码。

## setup() 函数
```
import { reactive } from 'vue'

export default {
  setup(props, context) {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // 还需要把值和方法return 返回
    return {
      state,
      increment
    }
  }
}

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>

```

## &lt;script setup>
```
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

# 响应式 API
## ref()
接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 .value。如果在 **&lt;template>** 可以不用写.value
```
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1

<template>
  {{ count }}
</template>
```
给ref传一个对象内部会去调用reactive()

## reactive()
返回一个对象的响应式代理。
```
const state = reactive({
  count: 0
})
state.count++
console.log(state.count) // 1
```

## toRef()
基于响应式对象上的一个属性，创建一个对应的 ref。这样创建的 ref 与其源属性保持同步：改变源属性的值也会同步关联修改。
```
const state = reactive({
  foo: 1,
  bar: 2
})

const fooRef = toRef(state, 'foo')

// 更改该 ref 会更新源属性
fooRef.value++
console.log(state.foo) // 2

// 更改源属性也会更新该 ref
state.foo++
console.log(fooRef.value) // 3
```
## toRefs()
将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref。每个单独的 ref 都是使用 toRef() 创建的。
```
const state = reactive({
 foo: 1,
 bar: 2
})

const stateAsRefs = toRefs(state)
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

## computed()
接受一个 getter 函数，返回一个只读的响应式 ref 对象。该 ref 通过 .value 暴露 getter 函数的返回值。它也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象。
```
const state = reactive({
  count: 0,
})

const doubleCount = computed(() => {
  return state.count * 2
})

console.log(doubleCount.value) // 输出 0

state.count++
console.log(doubleCount.value) // 输出 2
```

## watch(source，callback，options)
侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数。
- 第一个参数是侦听器的源。
- 第二个参数是在发生变化时要调用的回调函数。这个回调函数接受三个参数：新值、旧值，以及一个用于注册副作用清理的回调函数。当侦听多个来源时，回调函数接受两个数组，分别对应来源数组中的新值和旧值。
- 第三个可选的参数是一个对象，支持以下这些选项：
  - **immediate**：在侦听器创建时立即触发回调。 **默认：false**
  - **deep**：如果源是对象，强制深度遍历，以便在深层级变更时触发回调。 当直接侦听一个响应式对象时，侦听器会自动启用深层模式。 **默认：false**
  - **onTrack / onTrigger**：调试侦听器的依赖。
  - **flush**：调整回调函数的刷新时机。 'pre' | 'post' | 'sync'  **默认：'pre'**
    - 默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新之前被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。
    - 如果想在侦听器回调中能**访问被 Vue 更新之后的 DOM**，你需要指明 flush: 'post'
    - sync 同步调用
  

```
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`);
});
count.value++
```
多个值
```
const count1 = ref(0);
const count2 = ref(1);

watch([count1, count2], ([newVal1, newVal2] , [oldVal1, oldVal2]) => {
  console.log(`count1 changed from ${oldVal1} to ${newVal1}`);
  console.log(`count2 changed from ${oldVal2} to ${newVal2}`);
});
count1.value++
count2.value++
```
当直接侦听一个响应式对象时，侦听器会自动启用深层模式：
```
const state = reactive({ count: 0 })
watch(state, () => {
  /* 深层级变更状态所触发的回调 */
})
```
停止侦听器：
```
const stop = watch(source, callback)

// 当已不再需要该侦听器时：
stop()
```

## watchEffect(effect, options)
立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。
- 第一个参数就是要运行的副作用函数。会自动收集函数里面的依赖监听。
- 第二个参数是一个可选的选项，可以用来调整副作用的刷新时机或调试副作用的依赖。
  - **onTrack / onTrigger**：调试侦听器的依赖。
  - **flush**：调整回调函数的刷新时机。 'pre' | 'post' | 'sync'  **默认：'pre'**
  
```
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> 输出 0

count.value++
// -> 输出 1
```
和**watch()**用法一样，区别watchEffect可以自动收集需要监听的依赖。
常用的响应式API就这些，更多API可以去官网查看

# 生命周期钩子
⽣命周期钩⼦写法微调，xxx变成 OnXxx，如mouted 变成 onMounted。created和beforeCreate不再需要。Vue2中 ~~destroyed~~ 和 ~~beforeDestroy~~ 在Vue3换了名字，换成 **beforeUnmount** 和 **unmounted** 。

|  选项式 API   | 组合式 API  |
|  ----  | ----  |
| beforeCreate  | setup() |
| created  | setup() |
| beforeMount  | onBeforeMount |
| mounted  | onMounted |
| beforeUpdate  | onBeforeUpdate |
| updated  | onUpdated |
| beforeUnmount  | onBeforeUnmount |
| unmounted  | onUnmounted |
| errorCaptured  | onErrorCaptured |
| renderTracked  | onRenderTracked |
| renderTriggered  | onRenderTriggered |
| activated  | onActivated |
| deactivated  | onDeactivated |
| serverPrefetch  | onServerPrefetch |