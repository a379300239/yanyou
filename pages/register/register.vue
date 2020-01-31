<template>
    <view>
		<view class="div-logo">
			<image src="../../static/login/logo.png"/>
			<p>This is a logo</p>
		</view>
		
		<view class="div-form">
			<form @submit="register_submit">
				<!-- 背景-->
				<image src="../../static/login/rec.jpg" class="img-backImg"/>
				
				<!-- 头像 -->
				<image src="../../static/login/icon.jpg" class="img-icon"/>
				
				<!-- 用户名 -->
				<view>
					<input name="userName" class="input-userName" placeholder="Enter your username" />
				</view>
				
				<!-- 密码 -->
				<view style="width: 100%; position: relative;">
					<input name="passWord" class="input-passWord" placeholder="Enter your password" password="true" />
				</view>
				
				<view style="width: 100%; position: relative;">
					<input name="rePassWord" class="input-passWord" placeholder="Repeat your password" password="true" />
				</view>
				
				<!-- 提交 -->
				<button form-type="submit" class="button-submit" hover-class="button-submit-hover">SIGN UP</button>	
				
			</form>
			
			<view style="width: 100%;">
				<p class="button-back" @click="toLogin" plain="true" >BACK</p>
			</view>
		</view>
    </view>
</template>

<script>
	export default{
		data(){
			return {
			};
			
		},
		
		methods:{	
			register_submit:function(e){
				//逻辑
				var userName=e.detail.value.userName;
				var passWord=e.detail.value.passWord;
				var rePassWord=e.detail.value.rePassWord;
				
				if(userName=="" ||passWord=="" || rePassWord==""){
					uni.showToast({
						title:"请填写完整",
						icon:"none"
					})
				}
				else if(passWord!=rePassWord){
					uni.showToast({
						title:"密码不一致",
						icon:"none"
					});
				}
				else if(passWord==rePassWord){
					uni.request({
						url: 'https://getman.cn/mock/success',
						// url: 'https://getman.cn/mock/false', 
						success: (res) => {
							uni.hideLoading();
							if(res.data.success=="true"){
								uni.redirectTo({
									url:"../login/login",
									success:function(){
										uni.showToast({
											title:"注册成功"
										});
									}
								})
							}
							else{
								uni.showToast({
									title:"请求错误，请重试",
									icon:"none"
								})
							}
						}
					})
					
					uni.showLoading({
						title:"请求中"
					});
					
				}
			},
			
			toLogin:function(){
				uni.redirectTo({
					url:"../login/login"
				})
			}
			
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


.button-submit{
	margin-top: 100rpx;
	-webkit-border-radius: 100px;
	-moz-border-radius: 100px;
	border-radius: 100px;
	background-color: #000000;
	color:#FFFFFF;
	width: 300rpx;
}

.button-submit-hover{
	margin-top: 90rpx;
	width: 400rpx;
	height: 100rpx;
	background-color: #8F8F94;
}

.button-back{
	left: 0;
	right: 0;
	margin:0 auto;
	margin-top: 50rpx;
	width: 300rpx;
	font-size: 35rpx;
}

.whiteWord{
	color:#FFFFFF;
}

</style>
