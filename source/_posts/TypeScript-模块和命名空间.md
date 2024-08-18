---
title: TypeScript-模块和命名空间
date: 2024-08-17 15:29:04
tags: [TypeScript, 模块， 命名空间]
---
# 模块和命名空间
TypeScript 提供了两种主要的代码组织方式：模块（Modules）和命名空间（Namespaces）。它们都用于组织和管理代码，但有不同的用途和特性。
<!--more-->
## 模块（Modules）
在 TypeScript 中，可以通过 export 关键字来导出模块中的变量、函数、类和接口。导出的元素可以在其他模块中通过 import 关键字进行导入。
每个模块都拥有自己的作用域，不会与其他模块中的变量冲突。

### 导出和导入
```
// math.ts导出
export function add(x: number, y: number): number {
    return x + y;
}

// index.ts导入
import { add } from './math.ts'
```

### 默认导出
```
// a.ts导出
export default 'langpz'

// index.ts导入
import name from './a'
```
默认导出可以使用 default 关键字。默认导出的项在导入时不需要使用大括号 {}。

### 重命名导入和导出
在导入和导出时，可以对名称进行重命名，以避免命名冲突或使名称更加语义化。

```
// math.ts导出
export function add(x: number, y: number): number {
    return x + y;
}

export function subtract(x: number, y: number): number {
    return x - y;
}

export { add as sum, subtract as difference };

// index.ts导入
import { sum, difference } from './math';

console.log(sum(5, 3)); // 输出: 8
console.log(difference(5, 3)); // 输出: 2
```

## 命名空间（Namespaces）
命名空间是 TypeScript 提供的一种将代码分组的方式，适用于将代码组织在一个全局范围内。命名空间通过 namespace 关键字定义，通常用于在一个全局作用域中定义库或框架。

### 使用命名空间
```
namespace Utils {
    export function log(message: string): void {
        console.log(message);
    }

    export function error(message: string): void {
        console.error(message);
    }
}

// 使用命名空间中的函数
Utils.log('lanpz'); // 输出:lanpz
Utils.error('https://blog.langpz.com'); // 输出:https://blog.langpz.com
```

### 命名空间嵌套使用
```
namespace zoo {
    export class Dog {
        eat() {
            console.log('zoo dog');
        }
    }

    export namespace bear {
        export const name = '熊';
    }
}

console.log(zoo.bear.name); // 输出: 熊
```

### 合并命名空间
TypeScript 允许合并同名的命名空间，这在定义复杂库或框架时非常有用。
```
namespace Library {
    export function init(): void {
        console.log('Library initialized');
    }
}

namespace Library {
    export function shutdown(): void {
        console.log('Library shut down');
    }
}

// 使用合并后的命名空间
Library.init(); // 输出: Library initialized
Library.shutdown(); // 输出: Library shut down
```

# 模块（Modules） VS  命名空间（Namespaces）

| 特性       | 模块（Modules）                 | 命名空间（Namespaces）             |
|------------|--------------------------------|-----------------------------------|
| 作用域      | 独立作用域，避免命名冲突             | 全局作用域，可能导致命名冲突             |
| 依赖管理    | 通过导入和导出管理模块依赖           | 无法管理依赖，全部在全局可见             |
| 代码重用    | 易于在不同项目中重用               | 重用性较差，需要手动包含文件             |
| 动态加载    | 支持动态加载，提高性能               | 不支持动态加载，不适用于大型应用          |
| 兼容性      | 与 ECMAScript 标准兼容            | 非 ECMAScript 标准，现代项目不推荐使用    |
| 学习曲线    | 较为复杂，需要学习和配置             | 简单易用，适合快速开发                 |
| 适用场景    | 适用于大型项目和现代应用             | 适用于小型项目和库开发                |
