---
title: el-date-picker日期范围设置选择区间
date: 2022-10-01 09:48:14
tags: [vue2.0, element-ui]
keywords: el-date-picker日期范围设置选择区间
---

# el-date-picker日期范围设置选择区间
el-date-picker组件type="daterange" 选择日期范围的时候需要设置一个区间，官方api没直接提供参数，这个时候需要通过组件Picker Options来实现。
<!--more-->

## 代码
用到了onPick（选中日期后会执行的回调，只有当 daterange 或 datetimerange 才生效） 和 disabledDate（设置禁用状态，参数为当前日期，要求返回 Boolean	）， onPick触发就代表选中了第一个日期，根据第一个日期算出来选择范围。disabledDate 根据范围禁用不可选日期。

```
data() {
    return {
        daterange: {
          maxTime: "", // 最大日期
          minTime: "", // 最小日期
          max: 30,  // 限制范围 30天
        },
        pickerOptions: {
          onPick: time => {
            // 如果没有选择时间
            if (!time.maxDate) {
              // 算出时间范围（30天）
              let timeRange = this.daterange.max * 24 * 60 * 60 * 1000; 
              // 算出最大时间和最小时间
              this.daterange.minTime = time.minDate.getTime() - timeRange; 
              this.daterange.maxTime = time.minDate.getTime() + timeRange;
            } else {
              // 如果选了两个时间，那就清空本次范围判断数据，以备重选
              this.daterange.maxTime = "";
              this.daterange.minTime = "";
            }
          },
          disabledDate: time => {
            // 禁用不可选日期
            if (this.daterange.minTime && this.daterange.maxTime) {
              return (
                time.getTime() < this.daterange.minTime ||
                time.getTime() > this.daterange.maxTime
              );
            }
          }
        }
    }
}
```

[demo地址](https://jsfiddle.net/langpz/hky2to0d/20/)