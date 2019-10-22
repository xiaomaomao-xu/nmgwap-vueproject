import axios from 'axios';
import { req } from './axiosFun';
var http="http://localhost:8080/milk-tea"

/**
 * 消息管理
 **/
// 消息管理-获取消息中心列表
export const messageList = (params) => {  return req("post", http+"/MessagecenterbsController/getmessagecenter.do", params) };
// 消息管理-添加消息
export const messageinsertSave = (params) => { return req("post", http+"/MessagecenterbsController/addmessagecenter.do", params) };
// 消息管理-修改消息
export const messageupdateSave = (params) => { return req("post", http+"/MessagecenterbsController/updatemessage.do", params) };
// 消息管理-删除消息
export const messageDelete = (params) => { return axios.delete(http+"/MessagecenterbsController/delemessageceter.do?messageId=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
