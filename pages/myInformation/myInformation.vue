<template>
	<view style="width: 100%; background: #FAFAFA;">
		<!-- 留海设置 -->
		<view style="width: 100%; height: 65rpx; display: block; background: #000000;"></view>
		
		<view v-if="isLogin">
			<p>我的</p>
			<button @click="logout">退出登陆</button>
		</view>
		<view v-else>
			<p>未登录</p>
			<button @click="login">登陆</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin:false,
			}
		},
		methods: {
			onShow:function(){
				if(uni.getStorageSync('isLogin')=="yes"){
					this.isLogin=true;
				}
			},
			logout:function(){
				//清除缓存
				try{
					uni.setStorageSync('isLogin', 'no');
				}
				catch(e){console.log(e)}
				
				//页面效果
				this.isLogin=false;
			},
			login:function(){
				uni.navigateTo({
					url:"../login/login"
				})
			}
		}
	}
</script>

<style>

</style>
