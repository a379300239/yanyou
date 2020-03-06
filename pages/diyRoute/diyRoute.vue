<template>
	<!-- 已登陆 -->
	<view v-if="isLogin" style="width: 750rpx; background-color: #F2F2F2;">
				
		<!-- 无路线 -->
		<view v-if="!isHaveRoute" style="text-align: center;">
			<p style="width: 750rpx; text-align: center;font-size: 42rpx;margin-top: 200rpx;">“来一场说走就走的旅行”</p>
			<navigator url="../editRoute/choose_time/choose_time" style="width: 240rpx; height: 10rpx; display: inline-block;margin-top: 30rpx;">
				<image src="../../static/diyRoute/add_route.png" style="width: 236rpx;height: 72rpx;vertical-align: bottom;"></image>
			</navigator>
		</view>
		
		<!-- 有路线 -->
		<view v-else style="background-color: #F2F2F2;">
			
			<navigator url="../editRoute/choose_time/choose_time" style="display: inline-block;">
				<view class="addCardCss">
					<!-- 图片 -->
					<image src="../../static/diyRoute/img1.jpg" class="addCardCss_bgimg"></image>
					<image src="../../static/diyRoute/black.png" class="addButtonCss_black"></image>
					<!-- 增加按钮 -->
					<image src="../../static/diyRoute/addButton.png" class="addButtonCss_addimg"></image>
				</view>
			</navigator>
			
			<view class="addCardCss" v-for="(route,routeId) in userRoute" :key="route.num">
					<!-- 图片 -->
					<!-- 菜单按钮 -->
					<image :id="cardId_qianZhui+route.num" src="../../static/diyRoute/list.png" @click="open_doList($event,routeId)" class="addButtonCss_listChoose" />
					
					<!-- 背景图片 -->
					<image :src="route.routeImg" class="addCardCss_bgimg"></image>
					
					<navigator :url='diyRouteUrl+routeId' >
						<!-- 阴影遮罩 -->
						<image src="../../static/diyRoute/black.png" class="addButtonCss_black"></image>
					
						<!-- 文字 -->
						<p class="addCardCss_statue" v-if="route.routeStatu=='已结束'" style="background-color: #11B4D1;">{{route.routeStatu}}</p>
						<p class="addCardCss_statue" v-if="route.routeStatu=='进行中'" style="background-color: #11d174;">{{route.routeStatu}}</p>
						<p class="addCardCss_statue" v-if="route.routeStatu=='待进行'" style="background-color: #d17411;">{{route.routeStatu}}</p>
						<p class="addCardCss_siteName">{{route.routeName}}</p>
						<p class="addCardCss_siteTime">{{route.routeStartTime.replace(/-/g,'.')}}-{{route.routeEndTime.replace('-','.')}}</p>
					</navigator>
			</view>
			
			
			<!-- 操作菜单 -->
			<chunLei-popups v-model="showDoList" :popData="listData" @tapPopup="clickList" :x="x" :y="y" placement="top-end" theme="dark" dynamic></chunLei-popups>
			
		</view>
		
	</view>
	
	<!-- 未登录 -->
	<view v-else style="width: 750rpx; text-align: center;background: #F2F2F2;">
		<p style="width: 750rpx; text-align: center;font-size: 42rpx;margin-top: 200rpx;">“来一场说走就走的旅行”</p>
		<navigator url="../login/login" style="text-align: center;vertical-align: top; padding-top: 100rpx; padding-top: 30rpx;display: inline-block;color: #0099FF;">请先登陆</navigator>
	</view>
	
	
</template>

<script>
	import chunLeiPopups from "@/components/chunLei-popups/chunLei-popups.vue";
	export default {
		components:{
			chunLeiPopups
		},
		data() {
			return {
				isLogin:false,
				isHaveRoute:"",
				userInformation:"",
				userRoute:"",
				// diyRouteUrl:"../editRoute/save?routeName=",
				diyRouteUrl:"../editRoute/editRoute?routeId=",
				cardId_qianZhui:"cardId_",
				uid:0,
				showDoList:false,
				listData:[
					{
						title:'分享路线',
					},
					{
						title:'删除路线',
					},
				],
				x:0,
				y:0,
				currentRouteId:"",
				scrollTop:0,
				
				
			}
		},
		methods: {
			onShow:function(){
				
				//获得当前用户信息
				this.userInformation=uni.getStorageSync("currentUser");
				
				//判断是否登陆
				if(this.pd_login()){
					this.isLogin=true;
					//判断是否有路线
					if(this.pd_route()){
						//标志位，并获取用户路线
						this.isHaveRoute=true;
						this.userRoute=uni.getStorageSync(this.userInformation.userName+"_route");
						//添加index、当前日期状态
						var index=0;
						for(var routeId in this.userRoute){
							this.userRoute[routeId]['num']=index++;
							var currentTimeStatu=this.get_currentTimeStatu(routeId);
							this.userRoute[routeId]['routeStatu']=currentTimeStatu;
						}
					}
					else{
						this.isHaveRoute=false
					}
				}
				else{
					this.isLogin=false
				}
			},
			//页面滚动
			onPageScroll:function(e){
				this.scrollTop=e.scrollTop;			//记录页面值，动态显示菜单位置
				this.showDoList=false;				//页面滚动则关闭菜单
			},
			
			pd_login:function(){
				return this.userInformation.success=="true";
			},
			
			pd_route:function(){
				if(JSON.stringify(uni.getStorageSync(this.userInformation.userName+"_route"))!='{}' && uni.getStorageSync(this.userInformation.userName+"_route")!=''){
					return true;
				}
				else
					return false;
			},
			
			//获得当前时间状态，待进行，进行中，已进行
			get_currentTimeStatu:function(routeId){
				// console.log(this.userRoute[routeName])
				var startTime=new Date(this.userRoute[routeId].routeStartTime).getTime();			//都转换为格林威治时间秒数
				var endTime=new Date(this.userRoute[routeId].routeEndTime).getTime();
				var nowTime=new Date();
				var nowMonth=(nowTime.getMonth()+1)>=10?(nowTime.getMonth()+1):('0'+(nowTime.getMonth()+1));
				var nowDay=(nowTime.getDate()+1)>=10?(nowTime.getDate()):('0'+nowTime.getDate());

				nowTime=new Date(nowTime.getFullYear()+'-'+nowMonth+'-'+nowDay).getTime();
				
				//判断当前时间
				if(nowTime<startTime){
					return '待进行'
				}
				else if(nowTime>=startTime && nowTime<=endTime){
					return '进行中'
				}
				else{
					return '已结束'
				}
			},
			
			open_doList:function(e,routeId){
				
				//记录当前点击路线名称
				this.currentRouteId=routeId;
				
				//记录当前路线序号
				var routeNumber=this.userRoute[routeId]['num'];
				
				//打开选择菜单
				this.showDoList=true;
				
				//选择菜单打开位置控制
				let dom = uni.createSelectorQuery().in(this);
				var selectStringCode='#'+this.cardId_qianZhui+routeNumber;
				dom.select(selectStringCode).boundingClientRect(data =>{
					this.x=(data['right']-data['left'])/2+data['left'];
					this.y=(data['bottom']-data['top'])/2+data['top']+this.scrollTop/10+2;
				}).exec();
			},
			clickList:function(e){
				switch (e.title){
					case "分享路线":this.share_route(this.currentRouteId);
						break;
					case "删除路线":this.delete_route(this.currentRouteId);
						break;
					default:
						break;
				}
			},
			
			share_route:function(routeName){
				uni.showToast({
					title:"该功能暂未开发",
					icon:"none"
				});
				this.showDoList=!this.showDoList;
			},
			
			delete_route:function(routeName){
				//缓存中删除路线
				delete this.userRoute[routeName];
				var index=0;
				//存入数据库的数据，路线中无num项
				var databaseUserRoute=JSON.parse(JSON.stringify(this.userRoute));
				
				//重新定义编号
				for(var routeName1 in this.userRoute){
					this.userRoute[routeName1]['num']=index++;
					delete databaseUserRoute[routeName1]['num'];
					delete databaseUserRoute[routeName1]['routeStatu'];
				}
				
				//从数据库中删除路线
				uni.setStorageSync(this.userInformation.userName+"_route",databaseUserRoute);
				
				//判断是否还有路线，是否应该显示无路线界面
				if(!this.pd_route()){
					this.isHaveRoute=false;
				}
			}
			
		},
		computed:{
		}
	}
</script>

<style>
.addCardCss{
	margin-left: 10rpx;
	top:30rpx;
	width: 360rpx;
	height: 500rpx;
	position: relative;
	overflow: hidden;
	display: inline-block;
	-webkit-border-radius: 20rpx;	//圆角
	/* text-align: center; */
}

.addCardCss_bgimg{
	/* width: ; */
	height: 500rpx;
	position: absolute;
	z-index: 0;
}

.addButtonCss_black{
	position: absolute;
	z-index: 1;
	opacity: 0.7;
	width: 360rpx;
	height: 500rpx;
}


.addButtonCss_addimg{
	width: 100rpx;
	height: 100rpx;
	top:180rpx;
	left: 140rpx;
	text-align: center;
	position: absolute;
	z-index: 1;
}

.addCardCss_statue{
	position: absolute;
	z-index: 1;
	display: inline;
	top:40rpx;
	left: 20rpx;
	padding: 5rpx 20rpx;
	color: #FFFFFF;
	-webkit-border-radius: 20rpx;	//圆角
}

.addButtonCss_listChoose{
	padding: 30rpx;
	position: absolute;
	z-index: 2;
	top:35rpx;
	right: 0rpx;
	width: 60rpx;
	height: 15rpx;
}

.addCardCss_siteName{
	top:120rpx;
	left: 25rpx;
	margin-right: 30rpx;
	position: relative;
	z-index: 1;
	font-size: 50rpx;
	color: #FFFFFF;
}

.addCardCss_siteTime{
	top:135rpx;
	left: 25rpx;
	position: relative;
	z-index: 1;
	font-size: 30rpx;
	color: #FFFFFF;
}
</style>
