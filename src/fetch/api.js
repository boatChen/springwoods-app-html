// let BASEURL = 'http://10.5.0.64:8080';
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Toast, Indicator } from 'mint-ui';
Vue.use(VueAxios, axios);
let env = sessionStorage.getItem('env');
let BASEURL = 'http://agri.springwoods.com/ctower-mall-c/';
sessionStorage.getItem('env');
if (env == 'dev') {
    BASEURL = 'http://10.1.2.151/ctower-mall-c/';
}
axios.defaults.baseURL = BASEURL
axios.defaults.timeout = 60000 * 2;
axios.defaults.transformRequest = function(data) {
    let token = sessionStorage.getItem('token');
    if (token) {
        if (!data) {
            data = 'loginedtoken=' + token;
        } else {
            data += '&loginedtoken=' + token;
        }
    }
    Indicator.open('正在加载中');
    return data;
}
axios.interceptors.response.use((response) => {
        Indicator.close();
        return response;
    }, (error) => {
        Indicator.close();
        Toast({
            message: '请求超时'
        });
        return Promise.reject(error);
    })
    /**登录 */
export function fetchLogin(opt) {
    let url = "sys/login/scanLogin.do";
    return Vue.axios.post(url, `Id=${opt.id}`)
}
/**入库接口 */
export function fetchResource(ops) {
    let url = 'agriculture/semiFinishedStockDetail/addSemiFinishedStockDetail.do';
    return Vue.axios.post(url, `resourceid=${ops.resourceid}&entryType=${ops.entryType}`)
}
/**删除半成品库存 */
export function deleteStockDetail(ops) {
    return Vue.axios.post('agriculture/semiFinishedStockDetail/deleteStockDetail.do', `id=${ops.id}`);
}

export function fetchCount(ops) {
    let url = 'agriculture/task/calculateGrossweight.do';
    return Vue.axios.post(url, `batchNo=${ops.batchNo}&entryType=${ops.entryType}`)
}

export function addStorage(ops) {
    let url = 'agriculture/semiFinishedEntry/addSemiFinishedEntry.do';
    return Vue.axios.post(url, `entryId=${ops.id}&materialcode=${ops.material}&productname=${ops.chanpmc}&batchno=${ops.picibianh}&grossWeight=${ops.inboundweight}&aWeight=${ops.aweight}&bWeight=${ops.bweight}&bMinusWeight=${ops.b_weight}&cWeight=${ops.cweight}&aProportion=${ops.aProportion}&bProportion=${ops.bProportion}&cProportion=${ops.cProportion}&bMinusProportion=${ops.bMinusProportion}&entrydepartment=${ops.treasurydepartment}&submitter=${ops.deliveryman}&auditor=${ops.reviewer}&storeman=${ops.warehouse}&remark=${ops.note}&entrytype=${ops.isreentry}&todoEntryId=${ops.todoEntryId}&level=${ops.level|| ''}`)
}
/** 待入库 */
/** 新增待入库接口 */
export function addTodoEntry(ops) {
    return Vue.axios.post('agriculture/todoEntry/addTodoEntry.do', `batchno=${ops.batchno}&resourcecount=${ops.resourcecount}&weight=${ops.weight}&remarks=${ops.remarks}`)
}
/** 当前待入库记录查询 */
export function queryTodoEntry(ops) {
    return Vue.axios.post('agriculture/todoEntry/queryTodoEntry.do', `status=${ops.status}&area=${ops.area}&startTime=${ops.startTime}&endTime=${ops.endTime}&batchno=${ops.batchno}&beginPage=${ops.beginPage}&pageSize=${ops.pageSize}`)
}
/** 再入库接口 */
/** 查询再入库的库存详情信息 */
export function queryReEntrySemiFinishedStockDetail(ops) {
    let url = 'agriculture/semiFinishedStockDetail/queryReEntrySemiFinishedStockDetail.do';
    return Vue.axios.post(url, `entrytype=${ops.isReentry}`)
}
/** 通过批次编号查询半成品入库果级别的接口 */
export function queryProportion(opts) {
    return Vue.axios.post('agriculture/semiFinishedEntry/queryProportion.do',
        `batchno=${opts.batchno}`);
}
/** 再入库新增入库申请单接口 */
export function addReEntrySemiFinishedEntry(opts) {
    return Vue.axios.post('agriculture/semiFinishedEntry/addReEntrySemiFinishedEntry.do', `materialcode=${opts.materialcode}&productname=${opts.productname}&batchno=${opts.batchno}&grossweight=${opts.grossweight}&aweight=${opts.aweight}&bweight=${opts.bweight}&cweight=${opts.cweight}&entrydepartment=${opts.entrydepartment}&auditor=${opts.auditor}&storeman=${opts.storeman}&remark=${opts.remark}&bminusweight=${opts.bminusweight}&aproportion=${opts.aproportion}&bproportion=${opts.bproportion}&bminusproportion=${opts.bminusproportion}&cproportion=${opts.cproportion}&entryType=${opts.isreentry}&level=${opts.level}`)
}
/** 统计总重量 */
export function calculateGrossweight(opts) {
    return Vue.axios.post('agriculture/task/calculateGrossweight.do', `batchNo=${opts.batchNo}&level=${opts.level}&entryType=${opts.entryType}`)
}
/** 成品入库*/
/** 成品入库查询接口 */
export function selectFinishedProIn() {
    return Vue.axios.post('agriculture/FinishedStockDetail/queryFinishedEntryInfoLists.do')
}
/** 成品入库提交申请接口 */
export function addFinishedEntry(opts) {
    return Vue.axios.post('agriculture/FinishedEntry/addFinishedEntry.do', `materialcode=${opts.materialcode}&batchno=${opts.batchno}&packingtype=${opts.packingtype}&quantity=${opts.quantity}&entrydepartment=${opts.entrydepartment}&submitter=${opts.submitter}&auditor=${opts.auditor}&storeman=${opts.storeman}&remark=${opts.remark}&_in_id=${opts._in_id}&id=${opts.id}`)
}
/** 成品审核详情查询 */
export function finishedQueryEntryInfo(opts) {
    return Vue.axios.post('agriculture/FinishedEntry/queryEntryInfo.do', `id=${opts.id}`)
}

/**出库接口 */
/** 出库扫描接口，扫描一个调一次接口 */
export function semiFinishedOutScan(ops) {
    let url = 'agriculture/semiFinishedOut/semiFinishedOutScan.do';
    return Vue.axios.post(url, `resourceId=${ops.resourceId}`)
}
/** 查询出库扫描列表 */
export function querySemiFinishedOutScan(ops) {
    let url = 'agriculture/semiFinishedOut/querySemiFinishedOutScan.do';
    return Vue.axios.post(url)
}
/** 出库接口，最后提交的时候调用的接口 */
export function semiFinishedOut() {
    let url = 'agriculture/semiFinishedOut/semiFinishedOut.do';
    return Vue.axios.post(url)
}

/** 装盒 */
/** 查询任务 */
export function queryTaskInfoLists() {
    let url = 'agriculture/taskInfo/queryTaskInfoLists.do'
    return Vue.axios.post(url, 'linkid=T023&page_number=1&page_size=10&taskStatus=2,3&channel_id=1')
}
/** 获取计划名称 */
export function queryPlanInfoList() {
    let url = 'agriculture/planInfo/queryPlanInfoList.do';
    return Vue.axios.post(url);
}
/** 扫描后获取资源id，调用接口 */
export function handleSubtask(ops) {
    let url = 'agriculture/subTaskOper/handleSubtask.do';
    return Vue.axios.post(url, `resourceid=${ops.resourceid}&sort=1&piCiBianH=${ops.piCiBianH}`);
}

/** 装盒规格查询 */
export function queryPackingBoxSpecs(ops) {
    let url = 'agriculture/packingBoxSpecs/queryPackingBoxSpecs.do?';
    return Vue.axios.post(url, `id=${ops.id}`)
}


/** 装盒提交接口 ：packingtype、materialcode和specifications这三个参数扫描二维码可获取 */
export function addPackingBox(ops) {
    let url = 'agriculture/packingBox/addPackingBox.do';
    return Vue.axios.post(url, `packingtype=${ops.packingtype}&materialcode=${ops.materialcode}&specifications=${ops.specifications}&batchno1=${ops.batchno1}&batchno2=${ops.batchno2}&quantity=${ops.quantity}&packingman=${ops.packingman}&packingdate=${ops.packingdate}`)
}

/** 完成装盒 */
export function finishSubtask(ops) {
    let url = 'agriculture/subTaskOper/finishSubtask.do';
    return Vue.axios.post(url, `params=${ops.params}&piCiBianH=${ops.piCiBianH}&resourceid=${ops.resourceid}&sort=1`)
}
/** 扫描采收框获取批次编号 */
export function queryBatchNo(ops) {
    let url = 'agriculture/subTaskOper/queryBatchNo.do';
    return Vue.axios.post(url, `resourceid=${ops.resourceid}`)
}

/** 半成品在库表 */
export function querySemiFinishedStockInfoList(ops) {
    let url = 'agriculture/semiFinishedStock/querySemiFinishedStockInfoList.do';
    return Vue.axios.post(url, `beginPage=${ops.beginPage}&pageSize=${ops.pageSize}&batchno=${ops.batchno}&productname=${ops.productname}`);
}

/** 审核表 */
/** 查询审核列表 */
export function queryAuditStatusByAuditor(ops) {
    let url = 'agriculture/semiFinishedEntry/queryAuditStatusByAuditor.do';
    return Vue.axios.post(url, `pageSize=10&beginPage=1&complete=${ops.complete}`)
}
/** 查询我的申请列表 */
export function queryAuditStatusByOper(ops) {
    let url = 'agriculture/semiFinishedEntry/queryAuditStatusByOper.do';
    return Vue.axios.post(url, `pageSize=10&beginPage=1&complete=${ops.complete}`);
}
/** 查询审核详情 */
export function queryEntryInfo(ops) {
    let url = 'agriculture/semiFinishedEntry/queryEntryInfo.do';
    return Vue.axios.post(url, `id=${ops.id}`);
}
/** 取消申请 */
export function deleteEntry(opt) {
    return Vue.axios.post('agriculture/semiFinishedEntry/deleteEntry.do', `id=${opt.id}`)
}
/**审核接口， id为上边queryAuditStatusByAuditor接口返回的id， status， 1 表示驳回， 2 表是通过。 */
/** 半成品审核 */
export function auditEntry(ops) {
    let url = 'agriculture/semiFinishedEntry/auditEntry.do';
    return Vue.axios.post(url, `id=${ops.id}&status=${ops.status}&remark=${ops.remark}`);
}
/** 成品审核 */
export function finishedAuditEntry(opts) {
    let url = 'agriculture/FinishedEntry/auditEntry.do';
    return Vue.axios.post(url, `status=${opts.status}&remark=${opts.remark}&id=${opts.id}`)
}
/** 出入库记录*/
/** 半成品出入库数据查询 */
export function querySemiWarehouseRecord(ops) {
    let url = 'agriculture/semiFinishedEntry/queryEntryOutRecord.do';
    return Vue.axios.post(url, `record=${ops.value}&startTime=${ops.startTime}&endTime=${ops.endTime}&batchno=${ops.batchno}&area=${ops.area}`);
}
/** 成品出入库数据查询 */
export function queryWarehouseRecord(ops) {
    let url = 'agriculture/FinishedEntry/queryEntryOutRecord.do';
    return Vue.axios.post(url, `record=${ops.value}&startTime=${ops.startTime}&endTime=${ops.endTime}&packingtype=${ops.packingtype}&batchno=${ops.batchno}&beginPage=1&pageSize=10`);
}

/** 查询所有归属地 */
export function queryPlace() {
    let url = 'agriculture/column/queryAllColumn.do';
    return Vue.axios.post(url);
}
/** 查询归属地的计划 */
export function queryPlacePlan(ops) {
    let url = 'agriculture/planInfo/queryPlanInfoList.do';
    return Vue.axios.post(url, `guishud=${ops.guishud}`);
}

/** 成品在库查询 */
export function queryFinishedStockInfoList(opts) {
    return Vue.axios.post('agriculture/FinishedStock/queryFinishedStockInfoList.do', `packingtype=${opts.packingtype}&batchno=${opts.batchno}&beginPage=${opts.beginPage}&pageSize=${opts.pageSize}`)
}
/** 成品出库 */
export function finishedOut(opts) {
    return Vue.axios.post('agriculture/FinishedOut/finishedOut.do', `param=${opts.param}`)
}

/** 待入库*/
/** 待入库记录查询 */
export function queryWaitStorageRecord(ops) {
    let url = 'agriculture/todoEntry/queryTodoEntry.do';
    return Vue.axios.post(url, `status=${ops.status}&startTime=${ops.startTime}&endTime=${ops.endTime}&batchno=${ops.batchno}&area=${ops.area}`);
}