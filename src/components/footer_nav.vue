<template>
	<div class="footer appBar menu">
        <div class="menu-item" @click="go_page('/home')">
	        <span class="router-link" :class= "(paths=='/home' || paths=='/')? 'router-link-active' : '' ">
	            <span class="tool-icon" :class="(paths=='/home' || paths=='/')?'icon-home-active':'icon-home'"></span>
	            <i>首页</i>
	        </span>
        </div>
        <div class="menu-item" @click="go_page('/list')">
	        <span class="router-link" :class= "paths == '/list' ? 'router-link-active' : '' ">
	            <span class="tool-icon" :class="paths=='/list'?'icon-fojie-active':'icon-fojie'"></span>
	            <i>菜单</i>
	        </span>
        </div>
        <div class="menu-item" @click="go_page('/discover')">
	        <span class="router-link" :class= "paths == '/discover' ? 'router-link-active' : '' ">
	            <span class="tool-icon" :class="paths=='/discover'?'icon-lifo-active':'icon-lifo'"></span>
	            <i>发现</i>
	        </span>
        </div>
        <div class="menu-item" @click="go_page('/my')">
	        <span class="router-link" :class= "paths == '/my' ? 'router-link-active' : '' ">
	            <span class="tool-icon" :class="paths=='/my'?'icon-my-active':'icon-my'"></span>
	            <i>我的</i>
	        </span>
        </div>
    </div>
</template>

<script>
	import {changeUrl} from '../utils/changeUrl.js';
	export default {
    name: 'app-nav',
    data(){
        return {
           
        }
    },
    components: {
        
    },
    methods: {
    	changeUrl,
        go_page(link){//切换路由
        	changeUrl(link);
        }
    },
    computed: {
        
    },
    created(){
        this.paths = this.$route.path;
        console.log(this.paths);
    }
}
</script>

<style lang="less">
	
    .appBar {
	    position: absolute;
	    bottom: 0;
	    padding: 0;
	    width: 100%;
	    background: rgba(255,255,255,0.8);
	    border-top:1px solid #e2e3e3;
	    z-index: 999999;
	    .menu-item {
	        height: 54px;
	        display: flex;
	        justify-content: center;
	        align-items: center;
	        color: #707c81;
	        flex-wrap: wrap;
	        padding: 0;
	        width:25%;
	        float:left;
	        i{
	            font-style: normal;
	            font-size: 14px;
	            margin-top: 6px;
	        }
	        .router-link {
	            display: flex;
	            line-height: 1;
	            color: #999;
	            flex-direction: column;
	            justify-content: center;
	            text-align: center;
	            padding: 3px 0;
	           
	        }
	
	        .router-link-active {
	            border-bottom: none;
	            color: #ffa600;
	            font-weight: 600;
	            
	        }
	    }
	    
	    /*菜单样式*/
	    .tool-icon{
	        display: block;
	        height: 26px;
	        margin: 0 auto;
	        width: 26px;
	    }
	    .ivu-col-span-6{
	        width: 25%;
	        flex: 1;
	    }
	    .icon-home-active{
	        background:url(../../static/image/icon/homeNavS.png) no-repeat center center;
	        background-size: 23px;
	    }
	    .icon-home{
	        background:url(../../static/image/icon/homeNav.png) no-repeat center center;
	        background-size: 23px;
	    }
	    .icon-fojie-active{
	        background:url(../../static/image/icon/fjNavS.png) no-repeat center center;
	        background-size: 23px;
	    }
	    .icon-fojie{
	        background:url(../../static/image/icon/fjNav.png) no-repeat center center;
	        background-size: 23px;
	    }
	    .icon-lifo-active{
	        background:url(../../static/image/icon/lfNavS.png) no-repeat center center;
	        background-size: 23px;
	    }
	    .icon-lifo{
	        background:url(../../static/image/icon/lfNav.png) no-repeat center center;
	        background-size: 23px;
	    }
	    .icon-my-active{
	        background:url(../../static/image/icon/myS.png) no-repeat center center;
	        background-size: 23px;
	    }
	    .icon-my{
	        background:url(../../static/image/icon/my.png) no-repeat center center;
	        background-size: 23px;
	    }
	}
</style>
