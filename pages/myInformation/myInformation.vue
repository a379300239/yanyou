<template style="position: absolute;z-index: -4;">
	<!-- 已登录 -->
	<view style="width: 100%;position: absolute;z-index: 1;">
		
		<!-- 上方功能区 -->
		<view style="position: relative; width: 750rpx; height:600rpx;z-index: -2;">
			
			<!-- 背景 -->
			<view style="position: absolute; width: 750rpx; height:600rpx ;z-index: -1;background-color:#F5F5F5;">
				<!-- 上面蓝色展示部分 -->
				<image src="../../static/myInformation/bgImg_up.png" style="position: relative; width: 750rpx; height:300rpx;"></image>
				
				<!-- 下面灰白色部分 -->
				<view style="position: relative; width: 750rpx; height:300rpx; background-color:#F5F5F5;">
					
				</view>
			</view>
			
			<!-- 图标显示区 -->
			<view style="position: absolute;z-index: 1;width: 750rpx;text-align: center;top:94rpx" @click="login">
				<!-- 头像 -->
				<image v-if="isLogin" :src="userInformation.userImg" style="width: 150rpx;height: 150rpx;border-radius:50%;"></image>
				<image v-if="!isLogin" src="../../static/myInformation/default.jpg" style="width: 150rpx;height: 150rpx;border-radius:50%;"></image>
				
				
				<!-- 用户名 -->
				<view v-if="isLogin" style="width: 750rpx; display: inline-block;">
					<p style="font-size: 54rpx;display: inline-block; margin-right: 20rpx;">{{userInformation.userName}}</p>
					<image src="../../static/myInformation/editButton.png" style="width: 34rpx;height: 34rpx;display: inline-block;"></image>
				</view>
				
				<!-- 未登陆时显示 -->
				<view v-if="!isLogin" style="width: 750rpx; display: inline-block;">
					<p style="font-size: 40rpx;display: inline-block; margin-right: 20rpx;">点击登陆，体验更多</p>
				</view>
				
				<!-- 三个按钮：我的收藏、我的行程、我的定制 -->
				<view class="functionAreaCss">
					<navigator style="display: inline-block;" url="">
						<view>
							<image src="../../static/myInformation/myCollection.png"></image>
							<p>我的收藏</p>
						</view>
					</navigator>
					
					<navigator style="display: inline-block;" url="../diyRoute/diyRoute" open-type="switchTab">
						<view>
							<image src="../../static/myInformation/myRoute.png"></image>
							<p>我的行程</p>
						</view>
					</navigator>
					
					<navigator style="display: inline-block;" url="../customizingRoute/customizingRoute" open-type="switchTab">
						<view>
							<image src="../../static/myInformation/myCustom.png"></image>
							<p>我的定制</p>
						</view>
					</navigator>
					
				</view>
				
			</view>
			
			<!-- 白色面板 -->
			<view style="width: 750rpx; text-align: center; position: absolute;z-index: -1;top:152rpx">
				<view style="background-color: #FFFFFF; width: 638rpx; height: 358rpx;display: inline-block;border-radius:15rpx;box-shadow: 15rpx 15rpx 50rpx #ACE0EA;">
					<!-- 分割线 --> 
					<hr style="height:1rpx; width: 638rpx; border:none;border-top:1px solid  #EBF8FB; margin-top: 190rpx;" />
				</view>
			</view>
			
		</view>
		
		<!-- 下方功能区 -->
		<view style="margin-top: 12rpx;">
			<view class=" functionList" v-for="a_list in chooseData" >
				<view class="functionList_left">
					<image :src="a_list.icon_url" class="functionList_icon"></image>
					<p>{{a_list.name}}</p>
				</view>
				<image src="../../static/myInformation/fanhui.png" class="functionList_fanhui"></image>
			</view>
		</view>
		
		<button v-if="isLogin" @click="logout" style="margin-top: 30rpx;background-color: red;color: #FFFFFF;width: 400rpx;">退出登陆</button>
		
	</view>

</template>

<script>
	export default {
		data() {
			return {
				isLogin:"",
				userInformation:"",
				chooseData:[
					{
						name:"使用帮助",
						icon_url:"../../static/myInformation/use_help.png"
					},
					{
						name:"客服电话",
						icon_url:"../../static/myInformation/callNumber.png"
					},
					{
						name:"意见反馈",
						icon_url:"../../static/myInformation/backInformation.png"
					},
					{
						name:"分享APP",
						icon_url:"../../static/myInformation/share.png"
					},
					{
						name:"设置",
						icon_url:"../../static/myInformation/setting.png"
					}
				]
			}
		},
		methods: {
			onShow:function(){
				this.userInformation=uni.getStorageSync('currentUser');
				if(this.userInformation.success=="true"){
					this.isLogin=true;
				}
			},
			logout:function(){
				//退出，清除缓存
				try{
					uni.setStorageSync("currentUser","no");
					console.log(uni.getStorageSync("currentUser"));
				}
				catch(e){console.log(e)}
				
				//页面效果
				this.isLogin=false;
			},
			login:function(){
				if(!this.isLogin){
					uni.navigateTo({
						url:"../login/login"
					});
				}
			},
			navigatorTo:function(type,aim){
				if(type=='another'){
					switch (aim){
						case 'route':{
							uni.switchTab({
								url:'../diyRoute/diyRoute'
							});
						}break;
						case 'custom':{
							uni.switchTab({
								url:'../customizingRoute/customizingRoute'
							})
						}
						default:
							break;
					}
				}
				if(type='this'){
					
				}
			}
		}
	}
</script>

<style>
.functionAreaCss{
	margin-top: 20rpx;
	display: inline-block;
	width:750rpx;
	text-align: center;
	position: relative;
	z-index: 3;
	
}

.functionAreaCss view{
	margin: 0 20rpx 0 20rpx;
	display: inline-block;
	text-align: center;
}

.functionAreaCss image{
	display: inline-block;
	width: 75rpx;
	height: 75rpx;
}

.functionAreaCss p{
	display: block;
	text-align: center;
	color: #0FB9A7;
}

.functionList{
	width: 750rpx;
	height: 100rpx;
	/* height: 100rpx; */
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: #C8C7CC 1rpx solid;	
}

.functionList_left{
	display: flex;
	align-items: center;
}

.functionList_icon{
	margin:0rpx 24rpx 0rpx 24rpx;
	width: 50rpx;
	height: 50rpx;
}

.functionList p{
	display: inline-block;
	padding:0rpx 24rpx 0rpx 24rpx;
}

.functionList_fanhui{
	display: inline-block;
	margin:0rpx 24rpx 0rpx 24rpx;
	width: 18rpx;
	height: 34rpx;
	vertical-align: top;
}

</style>
