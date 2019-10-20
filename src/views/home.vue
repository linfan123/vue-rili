<template>
	<div id="pageDiv" :style="{'padding-top':isWeiXin || isApps?'0':''}">
		<my-heade :para_head="para_head" :title="'日历'"></my-heade>
		<!-- 页面的主要内容 -->
        <section class="content">
			<rili />
        </section>
	</div>
</template>

<script>
	import myHeade from '../components/myHeade';
    import { createAPI, addAccessToken, createOldAPI } from '../utils/request';
    import rili from './calendar/app'
	export default{
		name : 'home',
		components:{
           myHeade,
           rili
        },
        data : ()=>({
            isWeiXin:false,
            isApps:false,
            para_head:'no_btn',//传递给头部参数
        }),
        methods:{
        },
		created() {
		}
	}
</script>

<style lang="less" scoped>
    // 主要页面布局
    #pageDiv{
        background:#fff;
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        height: 100%;
        padding-top: 46px;
        padding-bottom: 0;
    }
    
    .content{
        height: 100%;
        background: #f2f2f2;
        overflow: scroll;
        padding-bottom:0;
    }
    
</style>