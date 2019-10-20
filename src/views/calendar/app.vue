<template>
    <div id="calendar-page" style="overflow: auto;height:100%;padding-bottom:0.4rem;padding-top:0.5rem;" v-if="isShow">
        <div class="flex" style="height: 100%;">
            <div v-if="isShow">
                <calendar
                    ref="calendar1"
                    :events="events"
                    :yangevents="yang_events"
                    :lunar="lunar"
                    :value="value"
                    @select="select"
                    @selectMonth="selectMonth"
                    @selectYear="selectYear">
                </calendar>
                <button @click="$refs.calendar1.setToday()">返回今天</button>
            </div>
            <div class="today">
                <p class="title" v-for="(item,index) in tip_arr" :key="index">{{item}}</p>
                <p class="title" v-if="rili_yin">农历{{rili_yin[5]+''+rili_yin[6]}}, {{rili_yin[4]}}年 {{rili_yin[3]}}年</p>
            </div>
        </div>
    </div>
</template>

<script>

import calendar from './calendar.vue'
import foli from './yinli_festival.json' // 获取节日表
import yangli from './yangli_festival.json' // 获取节日表
import {getDateTimeStamp} from '@/utils/time_slot_change'

export default {
  name: 'app',
  components: {
    calendar
  },
  data () {
    return {
      value: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()], // 默认日期
      lunar: true, // 显示农历
      events: {},
      yang_events: yangli,
      month: new Date().getMonth() + 1,
      timestamp: Date.now(),
      timeYear: new Date().getFullYear(),
      MIN_YEAR: 1891,
      MAX_YEAR: 2100,
      lunarInfo: [
        [0, 2, 9, 21936], [6, 1, 30, 9656], [0, 2, 17, 9584], [0, 2, 6, 21168], [5, 1, 26, 43344], [0, 2, 13, 59728],
        [0, 2, 2, 27296], [3, 1, 22, 44368], [0, 2, 10, 43856], [8, 1, 30, 19304], [0, 2, 19, 19168], [0, 2, 8, 42352],
        [5, 1, 29, 21096], [0, 2, 16, 53856], [0, 2, 4, 55632], [4, 1, 25, 27304], [0, 2, 13, 22176], [0, 2, 2, 39632],
        [2, 1, 22, 19176], [0, 2, 10, 19168], [6, 1, 30, 42200], [0, 2, 18, 42192], [0, 2, 6, 53840], [5, 1, 26, 54568],
        [0, 2, 14, 46400], [0, 2, 3, 54944], [2, 1, 23, 38608], [0, 2, 11, 38320], [7, 2, 1, 18872], [0, 2, 20, 18800],
        [0, 2, 8, 42160], [5, 1, 28, 45656], [0, 2, 16, 27216], [0, 2, 5, 27968], [4, 1, 24, 44456], [0, 2, 13, 11104],
        [0, 2, 2, 38256], [2, 1, 23, 18808], [0, 2, 10, 18800], [6, 1, 30, 25776], [0, 2, 17, 54432], [0, 2, 6, 59984],
        [5, 1, 26, 27976], [0, 2, 14, 23248], [0, 2, 4, 11104], [3, 1, 24, 37744], [0, 2, 11, 37600], [7, 1, 31, 51560],
        [0, 2, 19, 51536], [0, 2, 8, 54432], [6, 1, 27, 55888], [0, 2, 15, 46416], [0, 2, 5, 22176], [4, 1, 25, 43736],
        [0, 2, 13, 9680], [0, 2, 2, 37584], [2, 1, 22, 51544], [0, 2, 10, 43344], [7, 1, 29, 46248], [0, 2, 17, 27808],
        [0, 2, 6, 46416], [5, 1, 27, 21928], [0, 2, 14, 19872], [0, 2, 3, 42416], [3, 1, 24, 21176], [0, 2, 12, 21168],
        [8, 1, 31, 43344], [0, 2, 18, 59728], [0, 2, 8, 27296], [6, 1, 28, 44368], [0, 2, 15, 43856], [0, 2, 5, 19296],
        [4, 1, 25, 42352], [0, 2, 13, 42352], [0, 2, 2, 21088], [3, 1, 21, 59696], [0, 2, 9, 55632], [7, 1, 30, 23208],
        [0, 2, 17, 22176], [0, 2, 6, 38608], [5, 1, 27, 19176], [0, 2, 15, 19152], [0, 2, 3, 42192], [4, 1, 23, 53864],
        [0, 2, 11, 53840], [8, 1, 31, 54568], [0, 2, 18, 46400], [0, 2, 7, 46752], [6, 1, 28, 38608], [0, 2, 16, 38320],
        [0, 2, 5, 18864], [4, 1, 25, 42168], [0, 2, 13, 42160], [10, 2, 2, 45656], [0, 2, 20, 27216], [0, 2, 9, 27968],
        [6, 1, 29, 44448], [0, 2, 17, 43872], [0, 2, 6, 38256], [5, 1, 27, 18808], [0, 2, 15, 18800], [0, 2, 4, 25776],
        [3, 1, 23, 27216], [0, 2, 10, 59984], [8, 1, 31, 27432], [0, 2, 19, 23232], [0, 2, 7, 43872], [5, 1, 28, 37736],
        [0, 2, 16, 37600], [0, 2, 5, 51552], [4, 1, 24, 54440], [0, 2, 12, 54432], [0, 2, 1, 55888], [2, 1, 22, 23208],
        [0, 2, 9, 22176], [7, 1, 29, 43736], [0, 2, 18, 9680], [0, 2, 7, 37584], [5, 1, 26, 51544], [0, 2, 14, 43344],
        [0, 2, 3, 46240], [4, 1, 23, 46416], [0, 2, 10, 44368], [9, 1, 31, 21928], [0, 2, 19, 19360], [0, 2, 8, 42416],
        [6, 1, 28, 21176], [0, 2, 16, 21168], [0, 2, 5, 43312], [4, 1, 25, 29864], [0, 2, 12, 27296], [0, 2, 1, 44368],
        [2, 1, 22, 19880], [0, 2, 10, 19296], [6, 1, 29, 42352], [0, 2, 17, 42208], [0, 2, 6, 53856], [5, 1, 26, 59696],
        [0, 2, 13, 54576], [0, 2, 3, 23200], [3, 1, 23, 27472], [0, 2, 11, 38608], [11, 1, 31, 19176], [0, 2, 19, 19152],
        [0, 2, 8, 42192], [6, 1, 28, 53848], [0, 2, 15, 53840], [0, 2, 4, 54560], [5, 1, 24, 55968], [0, 2, 12, 46496],
        [0, 2, 1, 22224], [2, 1, 22, 19160], [0, 2, 10, 18864], [7, 1, 30, 42168], [0, 2, 17, 42160], [0, 2, 6, 43600],
        [5, 1, 26, 46376], [0, 2, 14, 27936], [0, 2, 2, 44448], [3, 1, 23, 21936], [0, 2, 11, 37744], [8, 2, 1, 18808],
        [0, 2, 19, 18800], [0, 2, 8, 25776], [6, 1, 28, 27216], [0, 2, 15, 59984], [0, 2, 4, 27424], [4, 1, 24, 43872],
        [0, 2, 12, 43744], [0, 2, 2, 37600], [3, 1, 21, 51568], [0, 2, 9, 51552], [7, 1, 29, 54440], [0, 2, 17, 54432],
        [0, 2, 5, 55888], [5, 1, 26, 23208], [0, 2, 14, 22176], [0, 2, 3, 42704], [4, 1, 23, 21224], [0, 2, 11, 21200],
        [8, 1, 31, 43352], [0, 2, 19, 43344], [0, 2, 7, 46240], [6, 1, 27, 46416], [0, 2, 15, 44368], [0, 2, 5, 21920],
        [4, 1, 24, 42448], [0, 2, 12, 42416], [0, 2, 2, 21168], [3, 1, 22, 43320], [0, 2, 9, 26928], [7, 1, 29, 29336],
        [0, 2, 17, 27296], [0, 2, 6, 44368], [5, 1, 26, 19880], [0, 2, 14, 19296], [0, 2, 3, 42352], [4, 1, 24, 21104],
        [0, 2, 10, 53856], [8, 1, 30, 59696], [0, 2, 18, 54560], [0, 2, 7, 55968], [6, 1, 27, 27472], [0, 2, 15, 22224],
        [0, 2, 5, 19168], [4, 1, 25, 42216], [0, 2, 12, 42192], [0, 2, 1, 53584], [2, 1, 21, 55592], [0, 2, 9, 54560]
      ],
      isShow: false,
      tipText: '', // 节日描述
      tip_arr: [],
      rili_yin: '' // 当前农历
    }
  },
  watch: {
    timeYear (curVal, oldVal) {
      this.value = [this.timeYear, this.month, 15]
      this.isShow = false
      this.events = {}
      this.transTime()
    }
  },
  methods: {
    // 日历事件
    select (val) {
      let value = val.date
      let time = value.join('-')
      let festival_arr = []
      if (val.text.eventName != undefined) {
        festival_arr.push(val.text.eventName)
      }
      if (val.text.yangeventName != undefined) {
        festival_arr.push(val.text.yangeventName)
      }
      if (val.text.lunar != undefined) {
        festival_arr.push(val.text.lunar)
      }
      this.tip_arr = festival_arr
      this.tipText = this.events[time] ? this.events[time] : '今日无节日'
      // 获取农历
      this.rili_yin = this.toLunar(value[0], value[1], value[2])
    },
    selectMonth (month, year) {
      this.timeYear = year
      this.month = month
    },
    selectYear (year) {
      this.timeYear = year
    },
    // 转换农历
    toLunar (year, month, day) {
      var yearData = this.lunarInfo[year - this.MIN_YEAR]
      if (year == this.MIN_YEAR && month <= 2 && day <= 9) {
        return [1891, 1, 1, '辛卯', '兔', '正月', '初一']
      }
      return this.lunarByBetween(year, this.betweenSolarDays(year, month, day, yearData[1], yearData[2]))
    },
    // 转换公历
    // @param year 阴历-年
    // @param month 阴历-月，闰月处理：例如如果当年闰五月，那么第二个五月就传六月，相当于阴历有13个月
    // @param date 阴历-日
    toSolar (year, month, day) {
      var yearData = this.lunarInfo[year - this.MIN_YEAR]
      var between = this.betweenLunarDays(year, month, day)
      var u = navigator.userAgent
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端

      var ms
      if (isiOS) {
        ms = new Date(year + '/' + yearData[1] + '/' + yearData[2]).getTime()
      } else {
        ms = new Date(year + '-' + yearData[1] + '-' + yearData[2]).getTime()
      }
      var s = ms + between * 24 * 60 * 60 * 1000
      var d = new Date()
      d.setTime(s)
      year = d.getFullYear()
      month = d.getMonth() + 1
      day = d.getDate()
      return [year, month, day]
    },
    // 是否闰年
    isLeapYear (year) {
      return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))
    },
    // 天干地支年
    lunarYear (year) {
      var gan = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己']
      var zhi = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未']
      var str = year.toString().split('')
      return gan[str[3]] + zhi[year % 12]
    },
    // 生肖年
    zodiacYear (year) {
      var zodiac = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊']
      return zodiac[year % 12]
    },
    // 公历月份天数
    // @param year 阳历-年
    // @param month 阳历-月
    solarMonthDays (year, month) {
      var FebDays = this.isLeapYear(year) ? 29 : 28
      var monthHash = ['', 31, FebDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      return monthHash[month]
    },
    // 农历月份天数
    lunarMonthDays (year, month) {
      var monthData = this.lunarMonths(year)
      return monthData[month - 1]
    },
    // 农历月份天数数组
    lunarMonths (year) {
      var yearData = this.lunarInfo[year - this.MIN_YEAR]
      var leapMonth = yearData[0]
      var bit = (+yearData[3]).toString(2)
      var months = []
      for (var i = 0; i < bit.length; i++) {
        months[i] = bit.substr(i, 1)
      }

      for (var k = 0, len = 16 - months.length; k < len; k++) {
        months.unshift('0')
      }

      months = months.slice(0, (leapMonth == 0 ? 12 : 13))
      for (var i = 0; i < months.length; i++) {
        months[i] = +months[i] + 29
      }
      return months
    },
    // 农历每年的天数
    // @param year 农历年份
    lunarYearDays (year) {
      var monthArray = this.lunarYearMonths(year)
      var len = monthArray.length
      return (monthArray[len - 1] == 0 ? monthArray[len - 2] : monthArray[len - 1])
    },
    //
    lunarYearMonths (year) {
      var monthData = this.lunarMonths(year)
      var res = []
      var temp = 0
      var yearData = this.lunarInfo[year - this.MIN_YEAR]
      var len = (yearData[0] == 0 ? 12 : 13)
      for (var i = 0; i < len; i++) {
        temp = 0
        for (let j = 0; j <= i; j++) {
          temp += monthData[j]
        }
        res.push(temp)
      }
      return res
    },
    // 获取闰月
    // @param year 农历年份
    leapMonth (year) {
      var yearData = this.lunarInfo[year - this.MIN_YEAR]
      return yearData[0]
    },
    // 计算农历日期与正月初一相隔的天数
    betweenLunarDays (year, month, day) {
      var yearMonth = this.lunarMonths(year)
      var res = 0
      for (var i = 1; i < month; i++) {
        res += yearMonth[i - 1]
      }
      res += day - 1
      return res
    },
    // 计算2个阳历日期之间的天数
    // @param year 阳历年
    // @param month
    // @param day
    // @param l_month 阴历正月对应的阳历月份
    // @param l_day  阴历初一对应的阳历天
    betweenSolarDays (year, month, day, l_month, l_day) {
      var time1 = new Date(year + '/' + month + '/' + day).getTime()
      var time2 = new Date(year + '/' + l_month + '/' + l_day).getTime()
      return Math.ceil((time1 - time2) / 24 / 3600 / 1000)
    },
    // 根据距离正月初一的天数计算阴历日期
    // @param year 阳历年
    // @param between 天数
    lunarByBetween (year, between) {
      var lunarArray = []
      var yearMonth = []
      var t = 0
      var e = 0
      var leapMonth = 0
      var m = ''
      if (between == 0) {
        t = 1
        e = 1
        m = '正月'
      } else {
        year = between > 0 ? year : (year - 1)
        yearMonth = this.lunarYearMonths(year)
        leapMonth = this.leapMonth(year)
        between = between > 0 ? between : (this.lunarYearDays(year) + between)
        for (var i = 0; i < 13; i++) {
          if (between == yearMonth[i]) {
            t = i + 2
            e = 1
            break
          } else if (between < yearMonth[i]) {
            t = i + 1
            e = between - ((yearMonth[i - 1]) ? yearMonth[i - 1] : 0) + 1
            break
          }
        }
        m = (leapMonth != 0 && t == leapMonth + 1)
          ? ('闰'.this.chineseMonth(t - 1))
          : this.chineseMonth(((leapMonth != 0 && leapMonth + 1 < t) ? (t - 1) : t))
      }
      lunarArray.push(year, t, e) // 年 月 日
      lunarArray.push(this.lunarYear(year),
        this.zodiacYear(year),
        m,
        this.chineseNumber(e)) // 天干地支年 生肖年 月份 日
      lunarArray.push(leapMonth) // 闰几月
      return lunarArray
    },
    // 中文月份
    chineseMonth (month) {
      var monthHash = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']
      return monthHash[month]
    },
    // 中文日期
    chineseNumber (num) {
      var dateHash = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      var res = ''
      if (num <= 10) {
        res = '初' + dateHash[num]
      } else if (num > 10 && num < 20) {
        res = '十' + dateHash[num - 10]
      } else if (num == 20) {
        res = '二十'
      } else if (num > 20 && num < 30) {
        res = '廿' + dateHash[num - 20]
      } else if (num == 30) {
        res = '三十'
      }
      return res
    },
    // 日期补零
    zeroPad (n) {
      return String(n < 10 ? '0' + n : n)
    },
    // 遍历佛历中的日期 将农历转化为公历
    transTime () {
      Object.keys(foli).forEach(element => {
        let y = `${this.timeYear}-${element}`// 拼接年月日
        let times = y.split('-')// 将年，月，日转为数组
        let y1 = this.toSolar(this.timeYear, times[1], times[2]).join('-')
        this.events[y1] = foli[element]// 节日名称
      })
      this.tipText = this.events[this.value.join('-')]
      setTimeout(() => {
        this.isShow = true
      }, 200)
    }
  },
  created () {
    this.transTime()
  },
  mounted () {
    // 默认选中
    setTimeout(() => {
      this.$refs.calendar1.setToday()
    }, 500)
  }
}
</script>

<style>
    .flex{
        box-sizing: border-box;
        display: -webkit-box;
        -webkit-box-pack: start;
        -webkit-box-align: start;
        display: -webkit-flex;
        -webkit-justify-content: space-between;
        -webkit-align-items: top;
        display: flex;
        justify-content: space-between;
        align-items: top;
        flex-flow:row wrap;
        overflow: auto;
    }
    .flex>div{
        width:100%;
        border-radius: 2px;
        position: relative;
    }
    .flex>div>span{
        position: absolute;
        left:0px;
        top:0px;
        padding:5px 10px;
        font-family: "PingFang SC","Hiragino Sans GB","STHeiti","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
        font-size:10px;
        border-radius:0 0 2px 0;
        background:#ea6151;
        color:#fff;
    }
    .flex>div>input{
        box-sizing: border-box;
        width:100%;
        margin-top:20px;
        border-radius: 2px;
        border:1px solid #dedede;
        padding:10px;
        font-size: 16px;
        background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwpAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGlmb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUuZW90PyNpZWZpeCIpIGZvcm1hdCgiZW1iZWRkZWQtb3BlbnR5cGUiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUudHRmIikgZm9ybWF0KCJ0cnVldHlwZSIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTQ0MjM3Mzg5Nl80NzU0NDU1LnN2ZyNpZm9udCIpIGZvcm1hdCgic3ZnIik7IH0KCl1dPjwvc3R5bGU+PC9kZWZzPjxnIGNsYXNzPSJ0cmFuc2Zvcm0tZ3JvdXAiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUsIDAuMDE1NjI1KSI+PHBhdGggZD0iTTcxMS4zMDYyIDI5MC42OTcyYzI0LjI4MjEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTU0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMjYgMC00My45ODggMTkuNzI4NC00My45ODggNDQuMDUzNXYyMDAuMTA0OTZDNjY3LjMxODMgMjcwLjk5MDMgNjg3LjAwMzYgMjkwLjY5NzIgNzExLjMwNjIgMjkwLjY5NzJ6TTYyMy40ODA4IDExMy40MjAzSDQwMC43NjQ5Mjh2NjYuNTEzOTJoMjIyLjcxNTkwNDAwMDAwMDAyVjExMy40MjAyODh6TTg4NC4wNTMgMTEzLjQyMDNoLTgyLjc3NDAxNnY2Ni4xNDUyOGg4NS45NDAyMjRjMjUuMjc4NSAwIDQ2LjYxMTUgMjEuMzc2IDQ2LjYxMTUgNDYuNjc3djE1My45Mjc2OEg5MC40Mzg2NTYwMDAwMDAwMXYtMTUzLjkyNzY4YzAtMjUuMyAyMS4zMzMtNDYuNjc3IDQ2LjYxMTUtNDYuNjc3aDg2LjUwMzQyNFYxMTMuNDIwMjg4aC04Mi42NDI5NDRjLTY0LjA4NiAwLTExNi41MDc2IDUyLjUwODctMTE2LjUwNzYgMTE2LjcwMzJ2Njc2LjgwMTUzNTk5OTk5OTljMCA2NC4xNzQxIDUwLjQ5MTQgMTE2LjY4MDcgMTE0LjU3NzQgMTE2LjY4MDdIODg0LjA1Mjk5MmM2NC4wNjI1IDAgMTE2LjUwNjYtNTIuNTA2NiAxMTYuNTA2Ni0xMTYuNjgwN1YyMzAuMTIzNTE5OTk5OTk5OThDMTAwMC41NTk2IDE2NS45MjkgOTQ4LjExNDQgMTEzLjQyMDMgODg0LjA1MyAxMTMuNDIwM3pNOTMzLjgyOTYgOTEwLjM1MTRjMCAyNS4zLTIxLjMzMyA0Ni42NzYtNDYuNjExNSA0Ni42NzZIMTM3LjA1MDExMTk5OTk5OTk4Yy0yNS4yNzg1IDAtNDYuNjExNS0yMS4zNzYtNDYuNjExNS00Ni42NzZWNDQ2LjQ0NTU2OEg5MzMuODI5NjMyVjkxMC4zNTEzNnpNMjY3LjEwODQgNjQ2LjE4MTljMzYuODc3MyAwIDY2Ljc1MjUtMjkuOTM5NyA2Ni43NTI1LTY2Ljg4MTUgMC0zNi45MjI0LTI5Ljg3NTItNjYuODYxMS02Ni43NTI1LTY2Ljg2MTEtMzYuODU0OCAwLTY2Ljc1MjUgMjkuOTM5Ny02Ni43NTI1IDY2Ljg2MTFDMjAwLjM1NTggNjE2LjI0MjIgMjMwLjI1MjUgNjQ2LjE4MTkgMjY3LjEwODQgNjQ2LjE4MTl6TTUxMS41NDg0IDY0Ni4xODE5YzM2Ljg1NTggMCA2Ni43NTI1LTI5LjkzOTcgNjYuNzUyNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTU3LTY2Ljg2MTEtNjYuNzUyNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzQ0NC43OTU5IDYxNi4yNDIyIDQ3NC42NzExIDY0Ni4xODE5IDUxMS41NDg0IDY0Ni4xODE5ek0yNjUuOTE2NCA4OTAuNzA5YzM2Ljg3NzMgMCA2Ni43NTE1LTI5LjkzOTcgNjYuNzUxNS02Ni44NjExIDAtMzYuOTQyOC0yOS44NzQyLTY2Ljg4MjYtNjYuNzUxNS02Ni44ODI2LTM2Ljg1NTggMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44ODI2QzE5OS4xNjM5IDg2MC43NjkzIDIyOS4wNTk2IDg5MC43MDkgMjY1LjkxNjQgODkwLjcwOXpNNTExLjU0ODQgODkwLjcwOWMzNi44NTU4IDAgNjYuNzUyNS0yOS45Mzk3IDY2Ljc1MjUtNjYuODYxMSAwLTM2Ljk0MjgtMjkuODk1Ny02Ni44ODI2LTY2Ljc1MjUtNjYuODgyNi0zNi44NzczIDAtNjYuNzUyNSAyOS45Mzk3LTY2Ljc1MjUgNjYuODgyNkM0NDQuNzk1OSA4NjAuNzY5MyA0NzQuNjcxMSA4OTAuNzA5IDUxMS41NDg0IDg5MC43MDl6TTc1NS42NDEzIDY0Ni4xODE5YzM2Ljg1NjggMCA2Ni43NTM1LTI5LjkzOTcgNjYuNzUzNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTY3LTY2Ljg2MTEtNjYuNzUzNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzY4OC44ODk5IDYxNi4yNDIyIDcxOC43NjQgNjQ2LjE4MTkgNzU1LjY0MTMgNjQ2LjE4MTl6TTMxMS43MDM2IDI5MC42OTcyYzI0LjI4MTEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTQ0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMTYgMC00My45ODkgMTkuNzI4NC00My45ODkgNDQuMDUzNXYyMDAuMTA0OTZDMjY3LjcxNDYgMjcwLjk5MDMgMjg3LjQwMiAyOTAuNjk3MiAzMTEuNzAzNiAyOTAuNjk3MnoiIGZpbGw9IiM1ZTdhODgiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==) no-repeat 8px 10px;
            padding-left: 36px;
            color:#666;
    }
    .flex .today{
        padding:0 0.8rem;
    }
    .flex .today>.title{
        width:100%;
        font-size:1.07rem;
        font-family:PingFangSC-Medium;
        font-weight:600;
        color:rgba(51,51,51,1);
        line-height:1.5rem;
    }
    .flex .today>.content{
        width:100%;
        margin-top: 0.5rem;
        font-size:0.8rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:1.2rem;
    }
</style>
