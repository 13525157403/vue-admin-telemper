let now = new Date(); //当前日期
let nowDayOfWeek = now.getDay() - 1; //今天本周的第几天
let nowDay = now.getDate(); //当前日
let nowMonth = now.getMonth(); //当前月
let nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //
let lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
let lastYear = lastMonthDate.getYear();
let lastMonth = lastMonthDate.getMonth();
//格式化日期：yyyy-MM-dd
function formatDate(date) {
  let myyear = date.getFullYear();
  let mymonth = date.getMonth() + 1;
  let myweekday = date.getDate();
  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return (myyear + "-" + mymonth + "-" + myweekday);
}
Date.prototype.DateAdd = function (strInterval, Number) {
  let dtTmp = this;
  switch (strInterval) {
    case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
    case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
    case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
    case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
    case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
    case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
  }
}
//任意天数
export function GetDateStr(AddDayCount) {
  let dd = new Date();
  let ddd = dd.DateAdd('d', AddDayCount);//三天后 
  let y = ddd.getFullYear();
  let m = ddd.getMonth() + 1;//获取当前月 
  let d = ddd.getDate();
  return y + "-" + m + "-" + d;
}
/**
 * 获取上周、本周、上月、本月、上季度、本季度的开始日期、结束日期 start
 */



//获得某月的天数
function getMonthDays(myMonth) {
  let monthStartDate = new Date(nowYear, myMonth, 1);
  let monthEndDate = new Date(nowYear, myMonth + 1, 1);
  let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}
//获得本季度的开始结束日期
export function getQuarterStartMonth() {
  let quarterStartMonth = null
  let quarterEndMonth = null
  if (nowMonth <= 3) {
    quarterStartMonth = new Date().getFullYear() + '-01-01 00:00:00'
    quarterEndMonth = new Date().getFullYear() + '-03-31 00:00:00'
  }
  if (3 < nowMonth && nowMonth <= 6) {
    quarterStartMonth = new Date().getFullYear() + '-04-01 00:00:00'
    quarterEndMonth = new Date().getFullYear() + '-06-30 00:00:00'
  }
  if (6 < nowMonth && nowMonth <= 9) {
    quarterStartMonth = new Date().getFullYear() + '-07-01 00:00:00'
    quarterEndMonth = new Date().getFullYear() + '-09-30 00:00:00'
  }
  if (nowMonth >= 10) {
    quarterStartMonth = new Date().getFullYear() + '-10-01 00:00:00'
    quarterEndMonth = new Date().getFullYear() + '-12-31 00:00:00'
  }
  return { quarterStartMonth, quarterEndMonth }
}


//获得本周的开始日期
export function getWeekStartDate() {
  let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
  return formatDate(weekStartDate);
}
//获得本周的结束日期
export function getWeekEndDate() {
  let weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
  return formatDate(weekEndDate);
}
//获得上周的开始日期
export function getLastWeekStartDate() {
  let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
  return formatDate(weekStartDate);
}
//获得上周的结束日期
export function getLastWeekEndDate() {
  let weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1);
  return formatDate(weekEndDate);
}
//获得本月的开始日期
export function getMonthStartDate() {
  let monthStartDate = new Date(nowYear, nowMonth, 1);
  return formatDate(monthStartDate);
}
//获得本月的结束日期
export function getMonthEndDate() {
  let monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
  return formatDate(monthEndDate);
}
//获得上月开始时间
export function getLastMonthStartDate() {
  if (lastMonth == 11) {
    var lastMonthStartDate = new Date(nowYear - 1, lastMonth, 1);
  } else {
    var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
  }
  return formatDate(lastMonthStartDate);
}
//获得上月结束时间
export function getLastMonthEndDate() {
  if (lastMonth == 11) {
    var lastMonthEndDate = new Date(nowYear - 1, lastMonth, getMonthDays(lastMonth));
  } else {
    var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
  }
  return formatDate(lastMonthEndDate);
}


