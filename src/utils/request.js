import axios from 'axios';
import router from '../router/index';
const { apiv1, api, url: baseURL } = window.TS_WEB;
// Export a method to create the requested address.
export const createRequestURI = PATH => `${baseURL}/${PATH}`;

// Created the request address of API.
export const createAPI = PATH => `${api}}/${PATH}`;

// Created the request address of API V1.
export const createOldAPI = PATH => `${apiv1}/${PATH}`;

// 注入access-token验证
export const addAccessToken = () => {
    axios.defaults.headers.common = {
        'Authorization': '123',
        'Accept': 'application/json'
    };
    return axios;
};

axios.interceptors.response.use(
    function(response) {
        return response;
    },
    // 错误请求处理
    function(error) {
        console.log('error:',error)
        if(error.response) {
            const { status } = error.response;
            // token失效 提示: 重新登录
        } else if(error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }

        return Promise.reject(error);
    }
);

export default axios;