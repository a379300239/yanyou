<template>
	<view class="startPageCss">
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			onLoad:function(){
			},
			onShow:function(){
				setTimeout(function(){
					uni.switchTab({
						url:"../index/index",
					});
				},2000);
			}
			
		}
	}
</script>

<style>
.startPageCss{
	background: url(../../static/startPage/startPage.jpg);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	width: 750rpx;
}

</style>
