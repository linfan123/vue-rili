<template>
    <!-- 页面头部 -->
    <div class="my-header">
    	<div class="title1">
    		{{title}}
    		<div v-if="para_head!='no_btn'">
    			<backBtn class='back_btn' :height="20" :width="20" :color="'#000'" v-if="para_head='btn1'"/>
    		</div>
    		
    	</div>
    	
    </div>
</template>

<script>
	import backBtn from '../../static/icons/Back';
    export default {
        name : 'heade',
        props: {
            para_head:{
            	type:[String,Number],
            	default:'no_btn'
            },
            title:{
            	type:[String,Number],
            	default:'小林app'
            }
        },
        components:{
            backBtn
        },
        data : ()=>({
            
        }),
        methods:{
           
        },
        created(){
        }
    }
</script>

<style lang="less" scoped>
    // 头部
    .my-header{
        position: absolute;
	    width: 100%;
	    height: 46px;
	    top: 0;
	    background: rgba(255, 255, 255, 0);
	    z-index: 3;
	    border-bottom: 1px solid #f2f2f2;
        .title1{
            text-align: center;
            font-size: 16px;
            color: #222;
            line-height: 45px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .back_btn{
            	position: absolute;
            	left:10px;
            	top:11px;
            }
        }
    }
</style>

   