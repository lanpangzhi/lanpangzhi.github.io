---
title: 手写vue日历组件
date: 2023-01-14 18:28:52
tags: [vue2.0]
keywords: 手写vue日历组件
---
# 手写vue日历组件
vue版本vue2，样式和参数参考element-ui的Calendar组件。自动补全上一月和下一月空白日期，支持周起始日设置，单元格日期自定义插槽，自定义右侧头部插槽。
坑点：闰年2月29天处理
<!--more-->

## 处理闰年问题代码
```
//判断是否为闰年
funtion isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

//获取当月的天数
funtion getDaysOfMonth(dateStr) {
    var date = new Date(dateStr);
    var year = date.getFullYear();
    var mouth = date.getMonth() + 1;
    var day = 0;

    if (mouth == 2) {
    day = isLeapYear(year) ? 29 : 28;
    } else if (
    mouth == 1 ||
    mouth == 3 ||
    mouth == 5 ||
    mouth == 7 ||
    mouth == 8 ||
    mouth == 10 ||
    mouth == 12
    ) {
    day = 31;
    } else {
    day = 30;
    }
    return day;
},
```

## 完整代码
分为头部和日历天数区域，dom结构和样式代码
参数
v-model  绑定值	 Date, String, Number
first-day-of-week 周起始日	Number  默认值 1
```
<template>
  <div class="calendar">
    <div class="calendar-header">
      <div class="left">
        <span class="month">{{ value.toString("yyyy年MM月") }}</span>
        <button @click="btnChangeMonth('prevMonth')">上个月</button>
        <button style="margin-left: 10px" @click="btnChangeMonth('nextMonth')">
          下个月
        </button>
      </div>
      <div class="right">
        <!-- 自定义右侧头部插槽 -->
        <slot name="right-header"></slot>
      </div>
    </div>

    <div class="calendar-body">
      <table class="table">
        <thead>
          <tr>
            <td>
              {{ week[firstDayOfWeek] }}
            </td>
            <td
              v-for="item in week.length - 1 - firstDayOfWeek"
              :key="week[item + firstDayOfWeek]"
            >
              {{ week[item + firstDayOfWeek] }}
            </td>
            <td v-for="item in firstDayOfWeek" :key="week[item - 1]">
              {{ week[item - 1] }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in days.length / 7" :key="index">
            <td
              :class="{ empty: !days[day + index * 7 - 1].date }"
              v-for="day in 7"
              :key="day + index * 7"
            >
              <!-- 单元格日期自定义插槽 -->
              <slot name="dateCell" :row="days[day + index * 7 - 1]">
                {{
                  days[day + index * 7 - 1] &&
                  days[day + index * 7 - 1].date.split("-")[2]
                }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calendar",
  model: {
    prop: "value",
    event: "monthChange",
  },
  props: {
    value: [Date, String, Number],
    firstDayOfWeek: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      week: ["日", "一", "二", "三", "四", "五", "六"],
      days: [],
    };
  },
  methods: {
    btnChangeMonth(month) {
      // 上一月
      if (month === "prevMonth") {
        this.$emit("monthChange", this.getPrevNextMonth(this.value, -1));
      }
      // 下一月
      if (month === "nextMonth") {
        this.$emit("monthChange", this.getPrevNextMonth(this.value, 1));
      }
    },
    init() {
      const date = this.value;
      const time = date.toString("yyyy-MM");
      const firstDayOfWeek = this.firstDayOfWeek;
      // 当月周一是星期几 0-6 0是星期日
      const days = this.getMonthDay(date);
      const fillDay = [];
      let day = [];
      // 一个月多少天
      const monthDay = this.getDaysOfMonth(date);
      // 补全空格上月日期
      const fill = (7 + days - firstDayOfWeek) % 7;
      for (let i = 0; i < fill; i++) {
        fillDay.push({ date: "" });
      }

      for (let j = 1; j <= monthDay; j++) {
        let d = j.toString().padStart(2, "0");
        day.push({ date: time + "-" + d });
      }
      day = [...fillDay, ...day];
      // 补全空格下个月日期
      while (day.length % 7 != 0) {
        day.push({ date: "" });
      }
      this.$set(this, "days", day);
    },
    //获取当月的天数
    getDaysOfMonth(dateStr) {
      var date = new Date(dateStr);
      var year = date.getFullYear();
      var mouth = date.getMonth() + 1;
      var day = 0;

      if (mouth == 2) {
        day = this.isLeapYear(year) ? 29 : 28;
      } else if (
        mouth == 1 ||
        mouth == 3 ||
        mouth == 5 ||
        mouth == 7 ||
        mouth == 8 ||
        mouth == 10 ||
        mouth == 12
      ) {
        day = 31;
      } else {
        day = 30;
      }
      return day;
    },
    //判断是否为闰年
    isLeapYear(year) {
      return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    },

    /**
     * 获取上一月或者下一个月
     * @param now 日期
     * @param addMonths 传-1 上个月,传1 下个月
     */
    getPrevNextMonth(now, addMonths) {
      var dd = new Date(now);
      var m = dd.getMonth() + 1;
      var y =
        dd.getMonth() + 1 + addMonths > 12
          ? dd.getFullYear() + 1
          : dd.getFullYear();
      if (m + addMonths == 0) {
        y = y - 1;
        m = 12;
      } else {
        if (m + addMonths > 12) {
          m = "01";
        } else {
          m = m + 1 < 10 ? "0" + (m + addMonths) : m + addMonths;
        }
      }
      return new Date(y, m, 0);
    },

    // 获取月份1号是周几
    getMonthDay(date) {
      var d = new Date(date);
      const y = d.getFullYear();
      const m = d.getMonth();
      return new Date(y, m, 1).getDay();
    },
  },
  created() {
    this.init();
  },
  watch: {
    value(val) {
      this.init();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.calendar {
  width: 100%;
  background: #fff;
  .calendar-header {
    overflow: hidden;
    .left {
      float: left;
      .month {
        display: inline-block;
        width: 96px;
        font-size: 16px;
        line-height: 32px;
        font-weight: 500;
        color: #333;
      }
    }
    .right {
      float: right;
    }
  }
  .calendar-body {
    width: 100%;
    padding: 0 1px;
    overflow-y: auto;
    .table {
      width: 100%;
      border-collapse: collapse;
      box-sizing: border-box;
      thead {
        td {
          padding: 8px 0;
          text-align: center;
        }
      }
      tbody {
        td {
          width: 14.28%;
          height: 80px;
          border: 1px solid #ebeef5;
          font-size: 18px;
          padding: 8px 14px;
          color: #666;
          &.empty {
            background: #f9f9f9;
          }
        }
      }
    }
  }
}
</style>
```

## 用法
所有插槽和参数的用法
```
// 自定义左侧头部
<Calendar v-model="new Date()">
    <div slot="right-header" style="color: red">自定义左侧头部</div>
</Calendar>

// 自定义日期
<Calendar v-model="new Date()">
    <template slot="dateCell" slot-scope="scope">
    {{ scope.row.date.split("-").slice(1).join("-") }}
    </template>
</Calendar>

// 自定义周起始日
<Calendar v-model="new Date()" :first-day-of-week="0"> </Calendar>
```


# demo
[demo地址](https://codesandbox.io/s/jolly-lamport-calendar-iinizn?file=/src/App.vue)