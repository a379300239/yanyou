<template>	
    <view>
		<view class="div-logo">
			<image src="../../static/login/logo.png"/>
			<p>This is a logo</p>
		</view>
		
		<view class="div-form">
			<form @submit="submit_form">
				<!-- 背景-->
				<image src="../../static/login/rec.jpg" class="img-backImg"/>
				
				<!-- 头像 -->
				<image src="../../static/login/icon.jpg" class="img-icon"/>
				
				<!-- 用户名 -->
				<view>
					<input name="userName" class="input-userName" placeholder="Enter your username"/>
				</view>
				
				<!-- 密码 -->
				<view style="width: 100%; position: relative;">
					<input name="passWord" class="input-passWord" placeholder="Enter your password" password="true"/>
				</view>
				
				<!-- 忘记密码 -->
				<p class="button-forgetPassWord">Forget password</p>
				
				<!-- 提交 -->
				<button form-type="submit" class="button-submit">SIGN IN</button>
				
			</form>
			
			<view style="width: 100%;">
				<p class="button-signUp" @click="toRegister" plain="true">SIGN UP</p>
			</view>
		</view>
    </view>
</template>

<script>
	export default{
		data(){
			return {
			}
		},
		
		methods:{
			toRegister:function(){
				uni.navigateTo({
					url:"../register/register",
					    animationType: 'pop-in',
						animationDuration: 200
				});
			},
			submit_form:function(e){
				uni.request({
					url: 'https://getman.cn/mock/success', 
					// url:'https://getman.cn/mock/false1',
					
					success: (res) => {
						uni.hideLoading();
						

						if(res.data.success=="true"){
							//登陆成功
							uni.switchTab({
								url:"../myInformation/myInformation",
								success:function(){
									uni.showToast({
										title:"登陆成功"
									});
								}
							});
							//缓存
							uni.setStorage({
								key: 'isLogin',
								data: 'yes'
							});
						}
						else{
							uni.showToast({
								title:"账号/密码错误，请重试",
								icon:"none"
							})
						}
						
					},
					fail:function(){
						uni.hideLoading();
						uni.showToast({
							title:"请求失败",
							icon:"none"
						});
					}
		});
				
				uni.showLoading({
					title:"请求中",
					mask:true
				});
			
			}
		},
		
		onLoad:function(option){
		}
	}
</script>

<style>
page{
	background-color:#73D2D6;
}


.div-logo{
	margin-top: 100rpx;
	margin-bottom: 80rpx;
	width: 750rpx;
	text-align: center;
}

.div-logo image{
	width: 200rpx;
	height: 200rpx;
}

.div-logo p{
	width: 300rpx;
	margin: 0 auto;
	border-bottom: 1rpx solid black;
	padding-bottom: 5rpx;
}


.div-form{
	width: 750rpx;
	text-align: center;
}

.img-backImg{
	left: 0;
	right: 0;
	margin:0 auto;
	width: 600rpx;
	height: 700rpx;
	position:absolute;
}

.img-icon{
	position: relative;
	left: 0;
	right: 0;
	margin:0 auto;
	margin-top: 80rpx;
	width: 200rpx;
	height: 200rpx;
	border-radius:50%;
}

.input-userName{
	margin-top: 50rpx;
	display: inline-block;
	width: 400rpx;
	border-bottom: 1rpx solid black;
	position: relative;
}

.input-passWord{
	margin-top: 30rpx;
	display: inline-block;
	width: 400rpx;
	border-bottom: 1rpx solid black;
	position: relative;
}

.button-forgetPassWord{
	position: relative;
	margin-top: 30rpx;
	font-size: 30rpx;
	color:#8F8F94
}

.button-submit{
	margin-top: 11 0rpx;
	-webkit-border-radius: 100px;
	-moz-border-radius: 100px;
	border-radius: 100px;
	background-color: #000000;
	color:#FFFFFF;
	width: 300rpx;
}


.button-signUp{
	left: 0;
	right: 0;
	margin:0 auto;
	margin-top: 50rpx;
	width: 300rpx;
	font-size: 35rpx;
}

</style>