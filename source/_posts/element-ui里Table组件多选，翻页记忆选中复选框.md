---
title: element-ui里Table组件多选，翻页记忆选中复选框
date: 2018-11-13 21:42:31
tags: [vue2.0, element-ui]
keywords: element-ui里Table组件分页记忆选中复选框
---
# element-ui里Table组件分页记忆选中复选框
需求分析：Table组件复选框选中后切换页码重新获取数据之前选中不丢失。
<!--more-->

## 使用Table组件里面reserve-selection和row-key来实现需求
```
 <template>
  <el-table
    ref="multipleTable"
    :data="tableData3"
    // 这里设置row-key
    :row-key="getRowKeys"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      // 这里设置reserve-selection为 true
      :reserve-selection="true"
      width="55">
    </el-table-column>
    <el-table-column
      label="日期"
      width="120">
      <template slot-scope="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      show-overflow-tooltip>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      },
      // 返回id设置row-key
      getRowKeys(row) {
        return row.id;
      },
    }
  }
</script>
```
在使用 reserve-selection 功能的情况下 row-key这个属性是必填的。
上面的代码就可以实现翻页选中状态不消失，分页的逻辑我就不写了。

# 参考
[https://element.eleme.io/#/zh-CN/component/table](https://element.eleme.io/#/zh-CN/component/table)