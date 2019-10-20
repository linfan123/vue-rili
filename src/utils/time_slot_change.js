/**
 * webapp常用方法
 * @module webapp常用方法
 */

/**
 * 时间转换
 * @class 时间转换
 */

/**
 *
 * @method getDateTimeStamp
 * @name 转换标准时间为时间戳
 */

// js时间转化为几天前,几小时前，几分钟前
function getDateTimeStamp (dateStr) {
  return Date.parse(dateStr.replace(/-/gi, '/'))
}

/**
 *
 * @method timezone
 * @name 返回一个时区的时间
 */
function timezone (utc, timezone, isTimestamp) {
  let timeZone = (new Date()).getTimezoneOffset()
  return !isTimestamp
    ? parseInt(parseInt(new Date(utc.replace(/-/g, '/')).getTime()) - 3600 * (timeZone / 60) * 1000)
    : (utc + 3600000 * timezone)
};

/**
 * 参数为时间戳，返回几天前，几月前，几小时前，只返回一个值
 * @method getDateDiff
 * @name 只返回一个时间区间
 */
function getDateDiff (dateTimeStamp) {
  var minute = 1000 * 60
  var hour = minute * 60
  var day = hour * 24
  var halfamonth = day * 15
  var month = day * 30
  var now = new Date().getTime()
  var diffValue = now - dateTimeStamp
  var result = ''
  if (diffValue < 0) {
    return
  }
  var monthC = diffValue / month
  var weekC = diffValue / (7 * day)
  var dayC = diffValue / day
  var hourC = diffValue / hour
  var minC = diffValue / minute
  if (monthC >= 1) {
    result = '' + parseInt(monthC) + '月前'
  } else if (weekC >= 1) {
    result = '' + parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    result = '' + parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    result = '' + parseInt(hourC) + '小时前'
  } else if (minC >= 1) {
    result = '' + parseInt(minC) + '分钟前'
  } else {
    result = '刚刚'
  }
  return result
}

/**
 * 参数为秒，如果是毫秒记得除以1000，返回类型为有则返回，可返回多个单位,如5天4时32分5秒，4时32分5秒，32分5秒
 * @method SecondToDate
 * @name 只返回一个时间区间
 */
function SecondToDate (msd) {
  var time = msd
  if (time != null && time != '') {
    if (time > 60 && time < 60 * 60) {
      time = parseInt(time / 60.0) + '分钟' + parseInt((parseFloat(time / 60.0) -
        parseInt(time / 60.0)) * 60) + '秒'
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time = parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) -
          parseInt(time / 3600.0)) * 60) + '分钟' +
        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
          parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
    } else if (time >= 60 * 60 * 24) {
      time = parseInt(time / 3600.0 / 24) + '天' + parseInt((parseFloat(time / 3600.0 / 24) -
          parseInt(time / 3600.0 / 24)) * 24) + '小时' + parseInt((parseFloat(time / 3600.0) -
          parseInt(time / 3600.0)) * 60) + '分钟' +
        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
          parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
    } else {
      time = parseInt(time) + '秒'
    }
  } else {
    time = '0天'
  }
  return time
}

/**
 * 参数为秒，返回几天，几月，几小时，只返回一个值
 * @method SecondToDate2
 * @name 只返回一个时间区间
 */
function SecondToDate2 (msd) {
  var time = msd
  if (time != null && time != '') {
    if (time > 60 && time < 60 * 60) {
      time = parseInt(time / 60.0) + '分钟'
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time = parseInt(time / 3600.0) + '小时'
    } else if (time >= 60 * 60 * 24 && time < 60 * 60 * 24 * 365) {
      time = parseInt(time / 3600.0 / 24) + '天'
    } else if (time >= 60 * 60 * 24 * 365) {
      time = parseInt(time / 3600.0 / 24 / 365) + '年'
    } else {
      time = parseInt(time) + '秒'
    }
  } else {
    time = '已结束'
  }
  return time
}

/**
 * 返回以连接符连接的当前时间，如-，可自定义需要的内容
 * @method timejoin
 * @name 只返回一个时间区间
 */
function timejoin (joinType, len) {
  var date = new Date()
  if (joinType == '-') {
    var seperator1 = '-'
  }
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (len == 1) {
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  }
  return currentdate
}

/**
 *
 * @method two_time_cha
 * @name 返回2个时间之间的差
 */
function two_time_cha (time1, time2) {
  var result = ''
  var minute = 1000 * 60
  var hour = minute * 60
  var day = hour * 24
  var halfamonth = day * 15
  var month = day * 30
  // 获取时间戳
  var tamp1 = new Date(time1).getTime()
  var tamp2 = new Date(time2).getTime()
  var diffValue = tamp2 - tamp1
  if (diffValue < 0) {
    return
  }
  var monthC = diffValue / month
  var weekC = diffValue / (7 * day)
  var dayC = diffValue / day
  var hourC = diffValue / hour
  var minC = diffValue / minute
  if (monthC >= 1) {
    result = '' + parseInt(monthC) + '月'
  } else if (weekC >= 1) {
    result = '' + parseInt(weekC) + '周'
  } else if (dayC >= 1) {
    result = '' + parseInt(dayC) + '天'
  } else if (hourC >= 1) {
    result = '' + parseInt(hourC) + '小时'
  } else if (minC >= 1) {
    result = '' + parseInt(minC) + '分钟'
  }
  return result
}

/**
 * 例：2018-01-01 12:00:00
 * @method 获取本地时间
 * @name 获取本地时间
 */
function getLocalTime () {
  let date = new Date()
  let len = date.getTime()
  let offset = date.getTimezoneOffset() * 60000
  let utctime = len + offset
  let seperator1 = '-'
  let seperator2 = ':'
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    ' ' + date.getHours() + seperator2 + date.getMinutes() +
    seperator2 + date.getSeconds()
  return currentdate
}

export {
  getDateTimeStamp,
  getDateDiff,
  SecondToDate,
  SecondToDate2,
  timejoin,
  two_time_cha, // 返回2个时间之间的差
  getLocalTime, // 获取本地时间
  timezone // 返回一个时区的时间
}
