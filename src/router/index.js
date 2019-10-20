import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home'//我的

Vue.use(Router)
/**
 * 路由守卫 登录检测 islogin
 *
 * 需要登录的页面路由需要添加 
 * meta.requiresAuth = true
 *
 * 登录后不可访问的路由需要添加
 * meta.canEnterOrNot = true
 * 
 */
const islogin=false;
const router = new Router({
	mode:'history',
	//mode:'hash',
	//base:'/dist2/',
  routes: [
    {
      path: '/',
      redirect:'/home'//重定向
    },
    {
      	path: '/home',
      	name: 'home',
      	component: home,
      	beforeEnter(routeTo, routeFrom, next) {
	      //next({ name: 'test2' })
	      next();
	    },
    }
  ]
});

export default router;
