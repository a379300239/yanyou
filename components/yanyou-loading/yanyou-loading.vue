<template>
	<view class="loadingCss">
		<view class="loadingCss_item">
			<image src="/static/loading/loading.png"></image>
			<p class="loading_loading">加载中 请您稍等</p>
			<p class="loading_bottom">loading...</p>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.loadingCss{
	width: 750rpx;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	bottom: 50rpx;
}
	
.loadingCss_item{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.loading_loading{
	color: #69758D;
	font-size: 40rpx;
	margin-top: 10rpx;
}

.loading_bottom{
	color: #14B4E0;
	font-size: 50rpx;
	font-weight: 100;
	margin-top: 20rpx;
}


</style>
