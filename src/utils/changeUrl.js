/**
 * 修改连接的统一方法
 */
import router from '../router/index';

function changeUrl (link) {//直接切换路由
  router.push(link);
};

function goTo (num) {//传递整数，前进或者后退
  router.go(num);
};

function replaceUrl (link) {//替换当前页
  router.replace(link) 
};

export {
  changeUrl,
  goTo,
  replaceUrl
};
