import request from '@/utils/request'


//首页
//信贷资产情况
export function surveycreditAssets() {
  return request({
    url: '/api/asset/management/home-page/survey/creditAssets',
    method: 'get'
  })
}
//监控预警统计
export function surveymonitorAlert() {
  return request({
    url: '/api/asset/management/home-page/survey/monitorAlert',
    method: 'get'
  })
}
//贷后回访统计
export function surveypostLoan() {
  return request({
    url: '/api/asset/management/home-page/survey/postLoan',
    method: 'get'
  })
}
//策略数据统计
export function surveystrategyData() {
  return request({
    url: '/api/asset/management/home-page/survey/strategyData',
    method: 'get'
  })
}

//监控预警趋势-左侧图表
export function monitorAlertTrends(data) {
  return request({
    url: '/api/asset/management/home-page/charts/monitorAlertTrends',
    method: 'get',
    params: data
  })
}

//监控预警趋势-右侧排名-接口查询量
export function monitorAlertRankinterface(data) {
  return request({
    url: '/api/asset/management/home-page/charts/monitorAlertRank/interface',
    method: 'get',
    params: data
  })
}
//监控预警趋势-右侧排名-任务调用量
export function monitorAlertRanktask(data) {
  return request({
    url: '/api/asset/management/home-page/charts/monitorAlertRank/task',
    method: 'get',
    params: data
  })
}
//监控预警趋势-风险策略统计
export function riskStrategyStats(data, code) {
  return request({
    url: `/api/asset/management/home-page/charts/riskStrategyStats/${code}`,
    method: 'get',
    params: { endDate: data.endDate, queryTimeType: data.queryTimeType, startDate: data.startDate }
  })
}
//客户分析-标签数据
export function tagData() {
  return request({
    url: `/api/asset/management/home-page/charts/tagData`,
    method: 'get'
  })
}
//贷后管理-回访完成率
export function returnVisitDeal(data) {
  return request({
    url: `/api/asset/management/home-page/charts/returnVisitDeal`,
    method: 'get',
    params: data
  })
}
//贷后管理-饼图
export function returnVisitList(data) {
  return request({
    url: `/api/asset/management/home-page/charts/returnVisitList`,
    method: 'get',
    params: data
  })
}
//风险策略统计-授信利率
export function creditRateAve(data) {
  return request({
    url: `/api/asset/management/home-page/charts/creditRateAve`,
    method: 'get',
    params: data
  })
}

