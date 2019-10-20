<template>
    <div class="calendar">
        <!-- 顶部日期切换栏 -->
        <div class="calendar-tools">
            <span class="calendar-prev" @click="prev">
                <svg width="20" height="20" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g class="transform-group">
                    <g transform="scale(0.015625, 0.015625)">
                        <path d="M671.968 912c-12.288 0-24.576-4.672-33.952-14.048L286.048 545.984c-18.752-18.72-18.752-49.12 0-67.872l351.968-352c18.752-18.752 49.12-18.752 67.872 0 18.752 18.72 18.752 49.12 0 67.872l-318.016 318.048 318.016 318.016c18.752 18.752 18.752 49.12 0 67.872C696.544 907.328 684.256 912 671.968 912z" fill="#5e7a88"></path>
                    </g>
                </g>
                </svg>
            </span>
            <span class="calendar-next"  @click="next">
                <svg width="20" height="20" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g class="transform-group">
                    <g transform="scale(0.015625, 0.015625)">
                        <path d="M761.056 532.128c0.512-0.992 1.344-1.824 1.792-2.848 8.8-18.304 5.92-40.704-9.664-55.424L399.936 139.744c-19.264-18.208-49.632-17.344-67.872 1.888-18.208 19.264-17.376 49.632 1.888 67.872l316.96 299.84-315.712 304.288c-19.072 18.4-19.648 48.768-1.248 67.872 9.408 9.792 21.984 14.688 34.56 14.688 12 0 24-4.48 33.312-13.44l350.048-337.376c0.672-0.672 0.928-1.6 1.6-2.304 0.512-0.48 1.056-0.832 1.568-1.344C757.76 538.88 759.2 535.392 761.056 532.128z" fill="#5e7a88"></path>
                    </g>
                </g>
                </svg>
            </span>
            <div class="calendar-info" @click.stop="changeYear">
                <!-- {{monthString}} -->
                <div class="month">
                    <div class="month-inner" :style="{'top':-(this.month*20)+'px'}">
                        <span v-for="(m,index) in months" :key="index">{{m}}</span>
                    </div>
                </div>
                <div class="year">{{year}}</div>
            </div>
        </div>
        <!-- 星期几 -->
        <table cellpadding="5">
        <thead>
            <!-- 第一行：周一至周日 -->
            <tr>
                <td v-for="(week,k0) in weeks" class="week" :key="k0">{{week}}</td>
            </tr>
        </thead>
        <tbody>
        <!-- 遍历日期 -->
        <tr v-for="(day,k1) in days" :style="{'animation-delay':(k1*30)+'ms'}" :key="k1">
            <td v-for="(child,k2) in day" :class="{'selected':child.selected,'disabled':child.disabled}" @click="select(k1,k2,$event,child)" :key="k2">
                <span :class="{'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}">{{child.day}}</span>
                <!-- 先展示阴历节日 -->
                <div class="text" v-if="child.eventName!=undefined" :class="{'isGregorianFestival':child.eventName!=undefined}">{{child.eventName}}</div>
                <!-- 再展示阳历节日 -->
                <div class="text" v-else-if="child.yangeventName!=undefined" :class="{'isLunarFestival':child.yangeventName,'isGregorianFestival':child.isGregorianFestival}">{{child.yangeventName}}</div>
                <!-- 再展示默认节日 -->
                <div class="text" v-else-if="child.lunar!=undefined" :class="{'isLunarFestival':child.isLunarFestival,'isGregorianFestival':child.isGregorianFestival}">{{child.lunar}}</div>
                <!-- 再展示阴历 -->
                <div class="text" v-else-if="child.lunarValue!=undefined">{{child.lunarValue}}</div>
            </td>
        </tr>
        </tbody>
        </table>

        <div class="calendar-years" :class="{'show':yearsShow}">
            <span v-for="(y,k3) in years" @click.stop="selectYear(y)" :key="k3" :class="{'active':y==year}">{{y}}</span>
        </div>

    </div>
</template>

<script>
import calendar from './calendar.js'
export default {
  props: {
    // 默认日期
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 是否小于10补零
    zero: {
      type: Boolean,
      default: false
    },
    // 屏蔽的日期
    disabled: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 是否显示农历
    lunar: {
      type: Boolean,
      default: false
    },

    // 自定义星期名称
    weeks: {
      type: Array,
      default: function () {
        return window.navigator.language.toLowerCase() == 'zh-cn' ? ['日', '一', '二', '三', '四', '五', '六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      }
    },
    // 自定义月份
    months: {
      type: Array,
      default: function () {
        return window.navigator.language.toLowerCase() == 'zh-cn' ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      }
    },
    // 自定义阴历事件
    events: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 自定义阳历事件
    yangevents: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      years: [],
      yearsShow: false,
      year: 0, // 当前年
      month: 0, // 当前月
      day: 0, // 当前为多少号
      days: [],
      multiDays: [],
      today: [],
      festival: {
        lunar: {
          '1-1': '春节'
        },
        gregorian: {
          '1-1': '元旦',
          '3-8': '妇女节',
          '3-12': '植树节',
          '4-5': '清明节',
          '5-1': '劳动节',
          '5-4': '青年节',
          '6-1': '儿童节',
          '7-1': '建党节',
          '8-1': '建军节',
          '9-10': '教师节',
          '10-1': '国庆节'
        }
      },
      rangeBegin: [],
      rangeEnd: []
    }
  },
  watch: {
    events () {
      this.render(this.year, this.month)
    },
    value () {
      this.init()
    }
  },
  mounted () {
    this.init()
    // 获取到的参数
    // console.log('events(转化后的对应公历节日):' + JSON.stringify(this.events))
    // console.log('默认日期：'+this.value)
  },
  methods: {
    // 初始化
    init () {
      let now = new Date()
      this.year = now.getFullYear()
      this.month = now.getMonth()
      this.day = now.getDate() // 当天是多少天
      if (this.value.length > 0) { // 如果有默认日期：2019,10,18
        this.year = parseInt(this.value[0])
        this.month = parseInt(this.value[1]) - 1
        this.day = parseInt(this.value[2])
        console.log('获取到默认日期:' + this.year, this.month, this.day)
      }
      this.render(this.year, this.month)
    },
    // 渲染日期
    render (y, m) {
      let firstDayOfMonth = new Date(y, m, 1).getDay() // 当月第一天是第几天，0，1，2，3，4，5，6
      let lastDateOfMonth = new Date(y, m + 1, 0).getDate() // 当月有多少天
      let lastDayOfLastMonth = new Date(y, m, 0).getDate() // 上一月有多少天
      this.year = y
      let seletSplit = this.value
      let i // 本月号数
      let line = 0 // 行数
      let temp = [] // 最终输出的二维数组
      let nextMonthPushDays = 1 // 定义初始值
      for (i = 1; i <= lastDateOfMonth; i++) { // 生成当月的天数
        let day = new Date(y, m, i).getDay() // 返回星期几（0～6）
        let k // 补充的号数
        // 第一行,补充行
        if (day == 0) { // 如果是周天，则第一行为空
          temp[line] = []
        } else if (i == 1) { // 第一天不是周天的第一天,则第一行补充前面上月的天数
          temp[line] = []
          k = lastDayOfLastMonth - firstDayOfMonth + 1
          for (let j = 0; j < firstDayOfMonth; j++) {
            temp[line].push(Object.assign( // 对象合并
              {
                day: k, // 号数
                disabled: true // 不可选择
              },
              this.getLunarInfo(this.computedPrevYear(), this.computedPrevMonth(true), k), // 获取默认节日信息
              this.getEvents(this.computedPrevYear(), this.computedPrevMonth(true), k), // 获取自定义节日信息
              this.getyangEvents(this.computedPrevYear(), this.computedPrevMonth(true), k) // 获取自定义节日信息
            ))
            k++
          }
        }

        // 生成本月的日期
        let chk = new Date()
        let chkY = chk.getFullYear()
        let chkM = chk.getMonth()
        // 匹配上次选中的日期
        if (parseInt(seletSplit[0]) == this.year && parseInt(seletSplit[1]) - 1 == this.month && parseInt(seletSplit[2]) == i) {
          // console.log("匹配上次选中的日期",lunarYear,lunarMonth,lunarValue,lunarInfo)
          temp[line].push(Object.assign(
            {day: i, selected: true},
            this.getLunarInfo(this.year, this.month + 1, i),
            this.getEvents(this.year, this.month + 1, i),
            this.getyangEvents(this.year, this.month + 1, i) // 获取自定义节日信息
          ))
          this.today = [line, temp[line].length - 1] // 当前坐标
        } else if (chkY == this.year && chkM == this.month && i == this.day && this.value == '') { // 没有默认值的时候显示选中今天日期
          // console.log("今天",lunarYear,lunarMonth,lunarValue,lunarInfo)
          temp[line].push(Object.assign(
            {day: i, selected: true},
            this.getLunarInfo(this.year, this.month + 1, i),
            this.getEvents(this.year, this.month + 1, i),
            this.getyangEvents(this.year, this.month + 1, i) // 获取自定义节日信息
          ))
          this.today = [line, temp[line].length - 1]
        } else {
          // 普通日期
          // console.log("设置可选范围",i,lunarYear,lunarMonth,lunarValue,lunarInfo)
          let options = Object.assign(
            {
              day: i, // 号数
              selected: false // 是否已选中
            },
            this.getLunarInfo(this.year, this.month + 1, i), // 获取默认节日
            this.getEvents(this.year, this.month + 1, i), // 获取自定义节日
            this.getyangEvents(this.year, this.month + 1, i) // 获取自定义节日信息
          )
          // 如果属于屏蔽的日期，则无法选中
          if (this.disabled.length > 0) {
            if (this.disabled.filter(v => { return this.year === v[0] && this.month === v[1] - 1 && i === v[2] }).length > 0) {
              options.disabled = true
            }
          }
          temp[line].push(options) // 加入此行
        }

        // 到周六换行
        if (day == 6 && i < lastDateOfMonth) {
          line++
        } else if (i == lastDateOfMonth) { // 到最后一天，补充灰块
          let k = 1 // 下月从一号开始
          for (let d = day; d < 6; d++) {
            temp[line].push(Object.assign(
              {
                day: k,
                disabled: true
              },
              this.getLunarInfo(this.computedNextYear(), this.computedNextMonth(true), k), // 获取默认节日
              this.getEvents(this.computedNextYear(), this.computedNextMonth(true), k), // 获取自定义节日
              this.getyangEvents(this.computedPrevYear(), this.computedPrevMonth(true), k) // 获取自定义节日信息
            ))
            k++
          }
          // 下个月除了补充的前几天开始的日期
          nextMonthPushDays = k
        }
      } // end for

      // console.log(this.year+"/"+this.month+"/"+this.day+":"+line)
      // 补充第六行让视觉稳定
      if (line <= 5 && nextMonthPushDays > 0) {
        // console.log({nextMonthPushDays:nextMonthPushDays,line:line})
        for (let i = line + 1; i <= 5; i++) {
          temp[i] = []
          let start = nextMonthPushDays + (i - line - 1) * 7
          for (let d = start; d <= start + 6; d++) {
            temp[i].push(Object.assign(
              {day: d, disabled: true},
              this.getLunarInfo(this.computedNextYear(), this.computedNextMonth(true), d),
              this.getEvents(this.computedNextYear(), this.computedNextMonth(true), d),
              this.getyangEvents(this.computedPrevYear(), this.computedPrevMonth(true), d) // 获取自定义节日信息
            ))
          }
        }
      }
      this.days = temp
    },
    computedPrevYear () {
      let value = this.year
      if (this.month - 1 < 0) {
        value--
      }
      return value
    },
    computedPrevMonth (isString) {
      let value = this.month
      if (this.month - 1 < 0) {
        value = 11
      } else {
        value--
      }
      // 用于显示目的（一般月份是从0开始的）
      if (isString) {
        return value + 1
      }
      return value
    },
    computedNextYear () {
      let value = this.year
      if (this.month + 1 > 11) {
        value++
      }
      return value
    },
    computedNextMonth (isString) {
      let value = this.month
      if (this.month + 1 > 11) {
        value = 0
      } else {
        value++
      }
      // 用于显示目的（一般月份是从0开始的）
      if (isString) {
        return value + 1
      }
      return value
    },
    // 获取预设节日信息
    getLunarInfo (y, m, d) {
      let lunarInfo = calendar.solar2lunar(y, m, d) // 公历转农历
      let lunarValue = lunarInfo.IDayCn
      let isLunarFestival = false // 是否有传统节日
      let isGregorianFestival = false // 是否有国际节日
      if (this.festival.lunar[lunarInfo.lMonth + '-' + lunarInfo.lDay] != undefined) { // 先传统节日
        lunarValue = this.festival.lunar[lunarInfo.lMonth + '-' + lunarInfo.lDay]
        isLunarFestival = true
      } else if (this.festival.gregorian[m + '-' + d] != undefined) { // 再国际节日
        lunarValue = this.festival.gregorian[m + '-' + d]
        isGregorianFestival = true
      }
      if (isLunarFestival || isGregorianFestival) {
        return {
          lunar: lunarValue,
          isLunarFestival: isLunarFestival,
          isGregorianFestival: isGregorianFestival
        }
      } else {
        return {
          lunarValue: lunarValue,
          isLunarFestival: isLunarFestival,
          isGregorianFestival: isGregorianFestival
        }
      }
    },
    // 获取自定义阴历事件
    getEvents (y, m, d) {
      if (Object.keys(this.events).length == 0) return false
      let eventName = this.events[y + '-' + m + '-' + d]
      // console.log(this.events['2020-03-12']) //仅可获取今年的节日
      let data = {}
      if (eventName != undefined) {
        data.eventName = eventName
      }
      return data
    },
    // 获取自定义阳历事件
    getyangEvents (y, m, d) {
      if (Object.keys(this.yangevents).length == 0) return false
      let eventName = this.yangevents[this.zeroPad(m) + '-' + this.zeroPad(d)]
      let data = {}
      if (eventName != undefined) {
        data.yangeventName = eventName
      }
      return data
    },
    // 上月
    prev (e) {
      e.stopPropagation()
      if (this.month == 0) {
        this.month = 11
        this.year = parseInt(this.year) - 1
      } else {
        this.month = parseInt(this.month) - 1
      }
      this.render(this.year, this.month)
      this.$emit('selectMonth', this.month + 1, this.year)
      this.$emit('prev', this.month + 1, this.year)
    },
    //  下月
    next (e) {
      e.stopPropagation()
      if (this.month == 11) {
        this.month = 0
        this.year = parseInt(this.year) + 1
      } else {
        this.month = parseInt(this.month) + 1
      }
      this.render(this.year, this.month)
      this.$emit('selectMonth', this.month + 1, this.year)
      this.$emit('next', this.month + 1, this.year)
    },
    // 选中日期
    select (k1, k2, e, child) {
      if (e != undefined) e.stopPropagation()
      // 取消上次选中
      if (this.today.length > 0) {
        this.days.forEach(v => {
          v.forEach(vv => {
            vv.selected = false
          })
        })
      }
      // 设置当前选中天
      this.days[k1][k2].selected = true
      this.day = this.days[k1][k2].day
      this.today = [k1, k2]
      let params = {
        date: [this.year, this.zero ? this.zeroPad(this.month + 1) : this.month + 1, this.zero ? this.zeroPad(this.days[k1][k2].day) : this.days[k1][k2].day],
        text: child
      }
      this.$emit('select', params)
    },
    // 根据当前年份改变年份数组中的年份
    changeYear () {
      if (this.yearsShow) {
        this.yearsShow = false
        return false
      }
      this.yearsShow = true
      this.years = []
      for (let i = ~~this.year - 10; i < ~~this.year + 10; i++) {
        this.years.push(i)
      }
    },
    // 选择年份
    selectYear (value) {
      this.yearsShow = false
      this.year = value
      this.render(this.year, this.month)
      this.$emit('selectYear', value)
    },
    // 返回今天
    setToday () {
      let now = new Date()
      this.year = now.getFullYear()
      this.month = now.getMonth()
      this.day = now.getDate()
      this.render(this.year, this.month)
      // 遍历当前日找到选中
      this.days.forEach(v => {
        let day = v.find(vv => {
          return vv.day == this.day && !vv.disabled
        })
        if (day != undefined) {
          day.selected = true
          let params = {
            date: [this.year, this.zero ? this.zeroPad(this.month + 1) : this.month + 1, this.zero ? this.zeroPad(this.day) : this.day],
            text: day
          }
          this.$emit('select', params)
        }
      })
    },
    // 日期补零
    zeroPad (n) {
      return String(n < 10 ? '0' + n : n)
    }
  }
}

</script>

<style scoped>
.calendar {
    margin:auto;
    width: 100%;
    min-width:300px;
    background: #fff;
    font-family: "PingFang SC","Hiragino Sans GB","STHeiti","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    user-select:none;
}

.calendar-tools{
    height:40px;
    font-size: 20px;
    line-height: 40px;
    color:#5e7a88;
}
.calendar-tools span{
    cursor: pointer;
}
.calendar-prev{
    width: 14.28571429%;
    float:left;
    text-align: center;
}
.calendar-info{
    padding-top: 3px;
    font-size:16px;
    line-height: 1.3;
    text-align: center;
}
.calendar-info>div.month{
    margin:auto;
    height:20px;
    width:100px;
    text-align: center;
    color:#5e7a88;
    overflow: hidden;
    position: relative;
}
.calendar-info>div.month .month-inner{
    position: absolute;
    left:0;
    top:0;
    height:240px;
    /*transition:top .5s cubic-bezier(0.075, 0.82, 0.165, 1);*/
}
.calendar-info>div.month .month-inner>span{
    display: block;
    font-size: 14px;
    height:20px;
    width:100px;
    overflow: hidden;
    text-align: center;
}
.calendar-info>div.year{
   font-size:10px;
   line-height: 1;
   color:#999;
}
.calendar-next{
    width: 14.28571429%;
    float:right;
    text-align: center;
}

.calendar table {
    clear: both;
    width: 100%;
    margin-bottom:10px;
    border-collapse: collapse;
    color: #444444;
}
.calendar td {
    margin:2px !important;
    padding:0px 0;
    width: 14.28571429%;
    height:60px;
    text-align: center;
    vertical-align: middle;
    font-size:14px;
    line-height: 125%;
    cursor: pointer;
    position: relative;
    vertical-align: top;
}
.calendar td.week{
    font-size:10px;
    pointer-events:none !important;
    cursor: default !important;
}
.calendar td.disabled {
    color: #ccc;
    pointer-events:none !important;
    cursor: default !important;
    opacity: 0.7;
}
.calendar td.disabled div{
    color: #ccc !important;
}
.calendar td.disabled span{
    color: #E29D4F !important;
}
.calendar td span{
    display:block;
    max-width:40px;
    height:30px;
    font-size: 16px;
    line-height:30px;
    margin:0px auto;
    border-radius:20px;
    font-weight: 600;
}
.calendar td:not(.selected) span:not(.red):hover{
    background:#f3f8fa;
    color:#444;
}
.calendar td:not(.selected) span.red:hover{
    background:#f9efef;
}

.calendar td.selected span{
    background-color: #ff6300;
    color: #fff;
}
.calendar td:first-child span{
    color:#ff6300;
}
.calendar td:last-child span{
    color:#ff6300;
}
.calendar td .text{
    position: absolute;
    top:30px;
    left:0;
    right:0;
    text-align: center;
    padding:2px;
    font-size:8px;
    line-height: 1.2;
    color:#999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.calendar td .text.isLunarFestival,
.calendar td .text.isGregorianFestival{
    color:#7180AC;
}
.calendar td.selected span.red{
    background-color: #E29D4F;
    color: #fff;
}
.calendar td.selected span.red:hover{
    background-color: #ea6151;
    color: #fff;
}
.calendar thead td {
  text-transform: uppercase;
  height:30px;
  vertical-align: middle;
}
.calendar-button{
    text-align: center;
}
.calendar-button span{
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    min-width: 5em;
    vertical-align: baseline;
    background:#5e7a88;
    color:#fff;
    margin: 0 .25em 0 0;
    padding: .6em 2em;
    font-size: 1em;
    line-height: 1em;
    text-align: center;
    border-radius: .3em;
}
.calendar-button span.cancel{
    background:#efefef;
    color:#666;
}
.calendar-years{
    position: absolute;
    left:0px;
    top:60px;
    right:0px;
    bottom:0px;
    background:#fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap:wrap;
    overflow: auto;
    transition:all .5s cubic-bezier(0.075, 0.82, 0.165, 1);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
}
.calendar-years.show{
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0px);
}
.calendar-years>span{
    margin:1px 5px;
    display: inline-block;
    width:60px;
    line-height: 30px;
    border-radius: 20px;
    text-align:center;
    border:1px solid #fbfbfb;
    color:#999;
}
.calendar-years>span.active{
    border:1px solid #5e7a88;
    background-color: #5e7a88;
    color:#fff;
}
</style>
