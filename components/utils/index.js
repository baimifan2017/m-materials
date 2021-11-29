
import { Message } from 'tinper-bee';

export const success = (msg) => {
  Message.create({ content: msg, color: 'success', duration: 3 });
}


/**
 * 数据返回统一处理函数
 * @param {*} response
 * @param {*} successMsg 成功提示
 */
export const processData = (response, successMsg) => {
  const result = {};
  try {
    if (typeof response != 'object') {
      Error('数据返回出错：1、请确保服务运行正常；2、请确保您的前端工程代理服务正常；3、请确认您已在本地登录过应用平台');
      // throw new Error('数据返回出错：1、请确保服务运行正常；2、请确保您的前端工程代理服务正常；3、请确认您已在本地登录过应用平台')
      return { result: null };
    }

    if ((response.code && response.code == '200') || (response.status && response.status == 1)) {
      if (successMsg) {
        success(successMsg)
      }
      result.status = 'success'
      result.data = response.data
      return { result }
    } else {
      Error(response.message || response.msg || '请求错误');
      result.status = 'error'
      return { result }
      // throw new Error(`错误:${(response.status)}`);
    }
  } catch (e) {
    return { result };
  }
};