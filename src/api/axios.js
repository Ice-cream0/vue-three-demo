/*
 * @Descripttion: 
 * @version: 
 * @Author: chenzhiyuan
 * @Date: 2023-01-09 09:11:22
 * @LastEditors: chenzhiyuan
 * @LastEditTime: 2023-05-05 13:04:17
 */
import axios from 'axios'
// axios.defaults.baseURL = baseURL;
// axios.defaults.timeout = 20000;

export const getJson = function (URL) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: URL,
      baseURL: "",
      dataType: 'json',
      crossDomain: true,
      cache: false
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

