<template>
  <div id="app">
  	<div class="app-views">
    	<router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data:() => ({
  	
  }),
  methods:{
  	
  },
  created(){

  }
}
</script>

<style lang="less">
	*{margin:0;padding:0;}
body,html{
		padding: 0;
    margin: 0;
    font-size: 14px;
    font-family: Helvetica, sans-serif;
    background-color: #f4f5f5;
    color: #333;
    height: 100%;
    overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  .app-views{
  	overflow: auto;
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
