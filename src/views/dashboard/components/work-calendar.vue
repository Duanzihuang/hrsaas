<template>
  <div>
    <el-row type="flex" justify="end">
      <!-- 年 -->
      <el-select
        v-model="year"
        style="width: 120px"
        size="small"
        @change="changeDate"
      >
        <el-option
          v-for="item in years"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <!-- 月 -->
      <el-select
        v-model="month"
        style="width: 120px;margin-left:10px;"
        size="small"
        @change="changeDate"
      >
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-row>

    <el-calendar v-model="date">
      <template slot="dateCell" slot-scope="{ date, data }" class="content">
        <p class="date-content">
          <span class="text">
            {{ data.day.split('-')[2] | formatDay }}
          </span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </p>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      years: [],
      year: 0, // 年
      month: 0, // 月
      date: new Date() // 日期
    }
  },
  created () {
    this.initYearsAndMonths()
  },
  filters: {
    formatDay (day) {
      if (Number(day) > 9) {
        return day
      } else {
        return day.substr(1)
      }
    }
  },
  methods: {
    // 初始化年月
    initYearsAndMonths () {
      const date = new Date()
      this.year = date.getFullYear()
      this.month = date.getMonth() + 1

      this.years = Array.from(Array(11), (item, i) => {
        return i + this.year - 5
      })
    },
    // 更改年
    changeDate () {
      const dateStr = `${this.year}-${this.month}-1`

      this.date = new Date(dateStr)
    },
    // 是否是周末
    isWeek (date) {
      // 当前选中的月
      const currentMonth = this.month - 1 === date.getMonth()
      return currentMonth && (date.getDay() === 6 || date.getDay() === 0)
    }
  }
}
</script>

<style scoped>
/deep/ .el-calendar-day {
  height: auto;
}
/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
/deep/ .el-calendar__header {
  display: none;
}
</style>
