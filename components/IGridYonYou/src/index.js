/**
 * @title 高级表格的基础应用(基本示例3)
 * @description 大数据渲染场景
 *
 */
 import Grid from "ac-gridcn";
import 'ac-gridcn/build/Gridcn.css';
import produce from "immer";
import { get } from 'lodash';
import React, { Component } from "react";
import { Loading, Tag } from 'tinper-bee';
import { processData } from "utils";
import request from "utils/request";
import './index.less';
 
 
 
 
 class IGrid extends Component {
     constructor(props) {
         super(props);
         this.state = {
             hasError: false, // 是否发送边界错误
             loading: false,
             dataSource: [], // 数据
             selectedRecord: {}, // 当前选中行
             paginationObj: {    // 分页信息
                 items: 1,
                 total: 1,
                 totalPage: 1,
                 activePage: 1,
                 pageSize: 15,
                 dataNum: 2
             },
 
             lastExtraParams: {} // 外界传入的额外过滤条件
         }
     }
 
     /**
      * 错误监听
      * @param error
      * @param errorInfo
      */
     componentDidCatch(error, errorInfo) {
         if (error) {
             this.setState({
                 hasError: true
             })
             console.error(errorInfo)
         }
     }
 
     componentDidMount() {
         const { paginationObj } = this.state;
         this.findByPage({}, paginationObj);
     }
 
     static defaultProps = {
         store: {
             url: '/',
             method: 'POST'
         }
     }
 
     /**
      * 
      * @param {*} extraParams  额外的查询参数
      * @param {*} pagination  分页信息
      */
     findByPage = (extraParams = {}, pagination) => {
         const { store } = this.props;
         const { paginationObj } = this.state;
         const { url, type = 'POST', params = {}, resMapping = {} } = store;
 
 
         let options = {
             method: type,
             data: {
                 page: pagination ? pagination.activePage : paginationObj.activePage,
                 pageSize: pagination ? pagination.pageSize : paginationObj.pageSize,
 
                 ...params,
                 ...extraParams
             }
         };
 
         if (type !== 'POST') {
             options.params = options.data;
             delete options.data
         }
         this.setState({ loading: true })
 
         request(url, options).then(res => {
             const { result } = processData(res);
             const { status, data } = result;
             if (status === 'success') {
                 const { dataList = 'content', pageSize = 'size', items = 'totalPages', activePage = 'number', total = 'totalElements' } = resMapping;
 
                 this.setState({
                     paginationObj: {
                         dataNum: pagination ? pagination.dataNum : paginationObj.dataNum,
                         pageSize: get(data, pageSize),
                         total: get(data, total),
                         items: get(data, items), // 总页数
                         activePage: get(data, activePage) + 1
                     },
                     dataSource: get(data, dataList)
                 })
             }
         }).finally(() => {
             this.setState({
                 loading: false,
                 lastExtraParams: extraParams ? extraParams : {},
             })
         })
     }
 
     onDataNumSelect = (index, value) => {
         let { paginationObj } = this.state;
         paginationObj.pageSize = value;
         paginationObj.dataNum = index;
         this.findByPage({}, paginationObj)
     }
 
     /**
      * 跳转指定页码
      *
      * @param {*} pageIndex
      */
     freshData = (pageIndex) => {
         let { paginationObj } = this.state;
         paginationObj.activePage = pageIndex;
         this.findByPage({}, paginationObj)
     }
 
     /**
      * 1、未提交
      * 2、待审批
      * 3、审批中
      * 4、审批通过
      * 5、审批不通过
      * 12、已驳回
      * 13、终止
      * 14、已撤回
      * 98、未处理
      * 99、已超期
      */
     onRenderState = (bpmState, bpmStateName) => {
         if (bpmState) {
             const state = Number(bpmState)
             let stateInfo = {
                 colors: 'light',
                 text: bpmStateName
             }
             if (state == 2 || state == 3 || state == 14 || state == 98 || state === 99) {
                 stateInfo.colors = 'warning';
             }
             else if (state == 5 || state == 12 || state == 13) {
                 stateInfo.colors = 'danger'
             }
             else if (state == 4) {
                 stateInfo.colors = 'success'
             }
 
             return <Tag colors={stateInfo.colors}>{stateInfo.text}</Tag>
         }
 
     }
     /**
      * 构造参数
      * 1、使用了immer消除参数副作用，防止与调用者相互影响。
      * @returns nextProps
      */
     constructorProps = () => {
         const nextProps = produce(this.props, draft => {
             if (Array.isArray(draft.columns)) {
                 draft.columns.map(item => {
                     if (!item.key) {
                         item.key = get(item, 'dataIndex');
                     }
                     if (!item.width) {
                         item.width = 150;
                     }
                     if (['bpmStateName', 'bpmState'].indexOf(item.dataIndex) >= 0) {
 
         
                         item.render = (text, record) => {
                             const state = Number(record.bpmState)
                             let stateInfo = {
                                 colors: 'light',
                                 text: record.bpmStateName
                             }
                             if (state === 2 || state === 3 || state === 14 || state === 98 || state === 99) {
                                 stateInfo.colors = 'warning';
                             }
                             else if (state == 5 || state == 12 || state === 13) {
                                 stateInfo.colors = 'danger'
                             }
                             else if (state === 4) {
                                 stateInfo.colors = 'success'
                             }
                             return <Tag colors={stateInfo.colors}>{stateInfo.text}</Tag> 
                         }
                     }
                 })
             }
         })
 
         return nextProps;
     };
 
 
     render() {
         const { dataSource, columns, loading, paginationObj } = this.state;
 
         const myPaginationObj = {
             activePage: paginationObj.activePage,
             items: `${paginationObj.items}`, // 总页数
             total: paginationObj.total,
             dataNum: paginationObj.dataNum,
 
             freshData: this.freshData,//点击下一页刷新的数据
             onDataNumSelect: this.onDataNumSelect, //每页大小改变触发的事件
             noBorder: true,
             // dataNum: [5,15, 25,50],
             horizontalPosition: 'center',
         }
 
         return (<>
             <Grid
                 className="demo"
                 rowKey={r => r.id}
                 columns={columns || []}
                 data={dataSource || []}
                 paginationObj={myPaginationObj}
                 // loadLazy={true}
                 // dataNum={pageSizeArr.indexOf(paginationObj.items)}
                 {...this.constructorProps()}
             />
             <Loading container={this} show={loading}></Loading>
         </>
         );
     }
 }
 
 export default IGrid;