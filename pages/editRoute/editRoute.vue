<template>
	<view style="background-color: #F5F5F5;">
		<!-- 封面 -->
		<view style="width: 750rpx; height: 400rpx; position: relative; overflow: hidden;display: flex;align-items: center;z-index: 1;">
			<!-- 背景图 -->
			<image :src="routeInformaion.routeImg" style="width: 750rpx; position: absolute;z-index: -1;"></image>
			
			<!-- 返回键 -->
			<navigator open-type="navigateBack">
				<image src="../../static/siteIntroduction/back.png" style="width:52rpx;height: 75rpx; position: absolute;z-index: 2;top:50rpx;margin-left: 30rpx;"></image>
			</navigator>
			
			<!-- 黑色遮罩 -->
			<image src="/static/diyRoute/black.png" style="width: 750rpx; position: absolute;z-index: 0;opacity: 0.65;"></image>
			
			<!-- 文字部分 -->
			<view style="width: 750rpx; text-align: center; color: #FFFFFF;position: absolute;z-index: 1;">
				<p style="font-size: 50rpx;">{{routeInformaion.routeName}}</p>
				<p style="font-size: 35rpx;margin-top: 20rpx;">{{get_date(routeInformaion.routeStartTime)}}-{{get_date(routeInformaion.routeEndTime)}}</p>
			</view>
		</view>
		
		<!-- 一天 -->
		<view v-for="(dayInformation,index) in routeInformaion.route" :key="index" style="display: inline-block;padding-top: 42rpx;width: 750rpx;">
			<!-- 上边，天数+日期 -->
			<view style="display: flex;align-items: center;">
				
				<view style="position: relative;display: flex;align-items: center;justify-content: center;z-index: 0;margin-left: 30rpx;">
					<!-- 天数：D1 -->
					<image src="/static/editRoute/number_icon.png" style="width: 56rpx;height: 56rpx;position: absolute;z-index: 0;"></image>
					<p style="position: relative; z-index: 2;color: #FFFFFF;font-size: 30rpx;">D{{index+1}}</p>
				</view>
				
				<!-- 日期 -->
				<p style="position: relative;margin-left: 30rpx;">{{get_nextDate(routeInformaion.routeStartTime,index)}}</p>
				
				<!-- 调整按钮，当日期内有天数且没有在操作（删除）时，出现 -->
				<navigator :url="modifySiteUrl(index)" v-if="dayInformation.length!=0 && isOperating==false" style="display: flex;align-items: center;position: absolute;right: 30rpx;">
					<view>
						<p style="border-radius: 40rpx; border: 1rpx solid #000000; width: 120rpx; height: 51rpx; font-size: 36rpx; letter-spacing: 1rpx; background-color: #F5F5F5; display: inline-block; text-align: center;padding: 3rpx 15rpx 3rpx 15rpx;">调整</p>
					</view>
				</navigator>
				
				<!-- 删除界面，删除时出现 -->
				<view style="display: flex;align-items: center;" v-if="isDeleting">
					<!-- 复选框 -->
					<checkbox style="position: absolute;right: 30rpx;" @click="choose_delete(index)"></checkbox>
					
					<!-- 确认按钮 -->
					<view style="position: fixed;bottom: 30rpx;z-index: 99; width: 750rpx;left: 0rpx;text-align: center;">
						<button style="width: 300rpx;background-color: #E3E3E3;color: #000000;display: inline-block;margin-right: 50rpx;" @click="cancel_delete">取消</button>
						<button style="width: 300rpx;background-color: #FF0000;color: #FFFFFF;display: inline-block;" @click="confirm_delete">删除</button>
					</view>
				</view>

			</view>
			
			
			<!-- 有行程 -->
			<view v-if="dayInformation.length!=0">
				<!-- 下边，竖线、行程 -->
				<!-- 单个景点 -->
				<view v-for="(siteInformation,index) in dayInformation" class="routeCss" :key="index">
					
					<!-- 景点、美食、酒店 -->
					<navigator
						:url="basicUrl+siteInformation.siteName"
						v-if="siteInformation.siteType=='site' || siteInformation.siteType=='food' || siteInformation.siteType=='hotel'">
						<view class="routeCss_content">
							<view class="routeCss_text">
								<p class="siteNameCss">{{siteInformation.siteName}}</p>
								<p class="sitePlayTimeCss">建议游玩{{siteInformation.sitePlayTime}}</p>
								<p class="siteGradeCss">评分{{siteInformation.siteGrade}}分</p>
							</view>
							
							<view class="routeCss_img">
								<view class="siteImgCss">
									<image :src="siteInformation.siteImg"></image>
								</view>
							</view>
						</view>
					</navigator>
					
					<!-- 交通 -->
					<view v-if="siteInformation.siteType=='traffic'" class="routeCss_content trafficCss">
						<p>{{siteInformation.startPlace}}-{{siteInformation.endPlace}} {{siteInformation.vehicle}}</p>
					</view>
					
					
					<!-- 自定义 -->
					<view v-if="siteInformation.siteType=='custom'" class="routeCss_content customCss">
						<p class="customCss_title">{{siteInformation.title}}</p>
						<p class="customCss_content">{{siteInformation.content}}</p>
					</view>
					
				</view>
			</view>
			
			<!-- 无行程 -->
			<view v-else class="routeCss">
				<navigator :url="modifySiteUrl(index)">
					<view class="routeCss_noRouteCss">
						<p>+添加行程</p>
					</view>
				</navigator>
			</view>
			
		</view>
		
		<!-- 悬浮菜单 -->
		<uni-fab 
			ref="fab"
			:content="menuContent" 
			v-if="isPopMenu"
			:popMenu="isPop"
			horizontal="right" 
			vertical="bottom" 
			direction="vertical"
			@trigger="click_fab" 
			@fabClick="click_menuButton" />
			
		<!-- 弹出层，修改日期 -->
		<view v-if="isPopUp" class="myPopupCss" @touchmove.stop.prevent="moveHandle">
			<view class="black_card"></view>
			<view class="modifyDayViewCss">
				<view class="modifyDayViewCss_dateCss" :value="modifyBeforeDate">
					<p>要修改的日期</p>
					<picker-view @change="modify_date($event,'beforeDate')">
						<picker-view-column>
							<view v-for="(day,index) in routeInformaion.route" :key="index">{{get_nextDate(routeInformaion.routeStartTime,index)}}</view>
						</picker-view-column>
					</picker-view>
				</view>
				
				<view class="modifyDayViewCss_dateCss">
					<p>修改至哪一天</p>
					<picker-view @change="modify_date($event,'afterDate')">
						<picker-view-column>
							<view v-for="(day,index) in routeInformaion.route" :key="index" >{{get_nextDate(routeInformaion.routeStartTime,index)}}</view>
						</picker-view-column>
					</picker-view>
				</view>
				
				<!-- 按钮 -->
				<view style="display: flex; justify-content: space-around;">
					<button class="modifyDayViewCss_cancel" @click="cancel_modify">取消</button>
					<button class="modifyDayViewCss_confirm" @click="confirm_modify">确认</button>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniFab from '@/components/uni-fab/uni-fab.vue';			//悬浮菜单
	import uniPopup from "@/components/uni-popup/uni-popup.vue"				//弹出层
	
	export default {
		data() {
			return {
				routeId:"",
				userInformation:"",				//用户信息
				routeInformaion:{}			,	//路线信息
				basicUrl:"../siteIntroduction/siteIntroduction?isEdit=false&siteName=",
				//悬浮菜单内容
				menuContent:[{
						text: '修改行程信息',
						active: false
					},
					{
						text: '增加一天',
						active: false
					},
					{
						text: '删除一天',
						active: false
					},
					{
						text: '修改一天',
						active: false
					}
				],
				isPopMenu:true,			//是否使用悬浮按钮
				isPop:true,			//是否弹出
				userRoute:{},
				isOperating:false,
				isDeleting:false,		//是否正在删除
				deleteDayNum:[],		//记录应删除的位置
				maskClick:false,		//禁止点击取消
				modifyBeforeDate:[0],	
				modifyAfterDate:[0],	//修改前、后日期
				isPopUp:false,
			}
		},
		methods: {
			onLoad:function(e){
				// 用户信息
				this.userInformation=uni.getStorageSync("currentUser");
				// 用户路线
				this.routeId=e.routeId;
				this.userRoute=uni.getStorageSync(this.userInformation.userName+"_route");
				this.routeInformaion=this.userRoute[this.routeId];
				
			},
			onShow:function(){
				// 用户信息
				this.userInformation=uni.getStorageSync("currentUser");
				// 当前路线
				this.userRoute=uni.getStorageSync(this.userInformation.userName+"_route");
				this.routeInformaion=this.userRoute[this.routeId];
			},
			onBackPress:function(options){
				// 正在删除
				if(this.isDeleting){
					this.cancel_delete();
					return true;
				}
				//正在修改
				else if(this.isPopUp){
					this.cancel_modify();
					return true;
				}
				//悬浮菜单打开
				else if(this.$refs.fab.isShow){
					this.$refs.fab.close();
					return true;
				}
				return false;
				
			},
			//得到输入data的后day天
			get_nextDate:function (date,day) {
				var week=['日','一','二','三','四','五','六']
				
				var s=date.split('-');
				var nDate=new Date(parseInt(s[0]),parseInt(s[1])-1,parseInt(s[2]));
				var nextDate=new Date(Date.parse(nDate)+day*24*60*60*1000);
				var year=nextDate.getFullYear();
				var mon=nextDate.getMonth()+1;
				var day=nextDate.getDate();
				var weekDay=week[nextDate.getDay()];
				return mon+'月'+day+'日'+' 周'+weekDay;
			},
			//标题显示
			get_date:function(date){
				var s=date.split('-');
				var nDate=new Date(parseInt(s[0]),parseInt(s[1])-1,parseInt(s[2]));
				var year=nDate.getFullYear();
				var mon=nDate.getMonth()+1;
				var day=nDate.getDate();
				return mon+'月'+day+'日'
			},
			//点击悬浮菜单按钮
			click_fab:function(e){
				switch (e.index){
					case 0:this.modify_routeInformation();break;
					case 1:this.add_day();break;
					case 2:this.delete_day();break;
					case 3:this.modify_day();break;
					default:
						break;
				}
			},
			//点击菜单内按钮
			click_menuButton:function(e){
			},
			//修改行程信息
			modify_routeInformation:function(){
				uni.navigateTo({
					url:"modify_routeInformation/modify_routeInformation?routeId="+this.routeId
				})
			},
			//更新日期，增加或者减少day天,更新日期及天数
			update_date:function(day){
				this.routeInformaion.routeDay+=day;
				this.routeInformaion.routeEndTime=this.get_nextDate_func(this.routeInformaion.routeEndTime,day);
			},
			//增加一天
			add_day:function(){
				this.routeInformaion.route.push([]);
				this.update_date(1);
				this.save();
			},
			get_nextDate_func:function (date,day) {
				var s=date.split('-');
				var nDate=new Date(parseInt(s[0]),parseInt(s[1])-1,parseInt(s[2]));
				var nextDate=new Date(Date.parse(nDate)+day*24*60*60*1000);
				var year=nextDate.getFullYear();
				var mon=nextDate.getMonth() + 1 < 10 ? '0' + (nextDate.getMonth() + 1) : nextDate.getMonth() + 1;
				var day=nextDate.getDate() < 10 ? '0' + nextDate.getDate() : nextDate.getDate();
				return year+'-'+mon+'-'+day;
			},
			over_operate:function(){
				this.isOperating=false;
				this.isPopMenu=true;
			},
			start_operate:function(){
				this.isOperating=true;
				this.isPopMenu=false;
			},
			//删除一天
			delete_day:function(){
				for(var i=0;i<this.routeInformaion.route.length;i++){
					this.deleteDayNum[i]=false;
				}
				//操作中，调整按钮消失
				this.start_operate();
				//删除中，出现复选框
				this.isDeleting=!this.isDeleting;
			},
			//点击复选框
			choose_delete:function(index){
				this.deleteDayNum[index]=!this.deleteDayNum[index];
			},
			//确认删除
			confirm_delete:function(){
				//利用cach数组保存删除后数组
				var cach=[],j=0;
				for(var i=0;i<this.routeInformaion.route.length;i++){
					//若为选中，则保存到cach
					if(this.deleteDayNum[i]!=true){
						cach[j]=this.routeInformaion.route[i];
						j++;
					}
					//删除一天
					else{
						this.update_date(-1);
					}
				}
				this.routeInformaion.route=cach;
				
				//操作结束,复选框消失
				this.over_operate();
				this.isDeleting=false;
				//保存当前操作到数据库
				this.save();
			},
			
			//取消删除
			cancel_delete:function(){
				//操作结束，复选框消失
				this.over_operate();
				this.isDeleting=false;
			},
			
			//修改一天
			modify_day:function(){
				this.start_operate();
				// this.$refs.showModifyDayView.open();
				this.open_myPopup();
			},
			
			//打开选择框
			open_myPopup:function(){
				//显示
				this.isPopUp=true;
				//默认值清零
				this.modifyBeforeDate=0;
				this.modifyAfterDate=0;
			},
			//禁止滚动形式需要
			moveHandle:function(){
			},
			
			//关闭选择框
			close_myPopup:function(){
				this.isPopUp=false;
			},
			
			//当日期修改时
			modify_date:function(e,type){
				switch (type){
					case "beforeDate":{
						this.modifyBeforeDate=e.detail.value[0];
					}break;
					case "afterDate":{
						this.modifyAfterDate=e.detail.value[0];
					}break;
					default:
						break;
				}
			},
			
			//确认修改
			confirm_modify:function(){
				this.routeInformaion.route.splice(this.modifyAfterDate+Number(this.modifyBeforeDate<this.modifyAfterDate),0,this.routeInformaion.route[this.modifyBeforeDate]);	//插入
				this.routeInformaion.route.splice(this.modifyBeforeDate+Number(this.modifyBeforeDate>this.modifyAfterDate),1)								//删除原来
				//结束操作、关闭选择框、保存
				this.over_operate();
				this.close_myPopup();
				this.save();
			},
			
			//取消修改
			cancel_modify:function(){
				this.over_operate();
				this.close_myPopup();
				
			},
			
			//保存当前信息到数据库
			save:function(){
				this.userRoute[this.routeId]=this.routeInformaion;
				uni.setStorageSync(this.userInformation.userName+"_route",this.userRoute);
			},
			//跳转到新页面URL
			modifySiteUrl:function(dayId){
				var url="modifySite/modifySite?routeId="+this.routeId+"&dayId="+dayId;
				return url;
			}
			
		},
		components:{
			uniFab,
			uniPopup
		}
	}
</script>

<style>
.routeCss{
	position: relative;
	display: inline-block;
	border-left: 1rpx solid #C8C7CC;
	margin-left: 48rpx;
	padding-top: 44rpx;
	padding-left: 44rpx;
}

.routeCss_noRouteCss{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 620rpx;
	background-color: #EBEBEB;
	margin: 65rpx 0 65rpx 0;
	padding: 44rpx 0 44rpx 0;
	border-radius: 20rpx;
}

.routeCss_noRouteCss p{
	color: #0792ab;
}

.routeCss_content{
	width: 620rpx;
	position: relative;
	border-radius: 30rpx;
	background-color: #FFFFFF;
	display: inline-block;
}

.routeCss_text{
	vertical-align: top;
	display: inline-block;
	padding: 26rpx 40rpx 26rpx 40rpx;
}

.routeCss_img{
	vertical-align: bottom;
	display: inline-block;
	margin-left: 20rpx;
}

.siteNameCss{
	font-size: 35rpx;
}

.sitePlayTimeCss{
	margin-top: 46rpx;
	color: #666666;
	font-size: 32rpx;
}

.siteGradeCss{
	margin-top: 20rpx;
	color: #666666;
	font-size: 32rpx;
}

.siteImgCss{
	position: absolute;
	right: 30rpx;
	bottom: 30rpx;
	width: 225rpx; 
	height: 130rpx; 
	overflow: hidden;
	border-radius: 20rpx;
}

.siteImgCss image{
	width: 225rpx;
	height: 130rpx; 
}

.trafficCss{
	text-align: center;
	padding: 40rpx 0 40rpx 0;
}

.customCss{
	padding: 20rpx 0 20rpx 20rpx;
}

.customCss_title{
	
}

.customCss_content{
	margin-top: 20rpx;
	color: #666666;
	font-size: 32rpx;
}

.myPopupCss{
	width: 750rpx;
	height: 100%;
	display: flex;
	align-items: center;
	position: fixed; 
	z-index: 3;
	top:0rpx;
	padding: 25rpx;
}

.black_card{
	width: 750rpx;
	height: 100%;
	position: absolute;
	left: 0rpx;
	z-index: 3;
	background-color: #000000;
	opacity: 0.6;
	
}

.modifyDayViewCss{
	position: relative;
	z-index: 3;
	text-align: center;
	background-color: #F5F5F5;
	width: 700rpx;
	border-radius: 20rpx;
	padding:20rpx 0 20rpx 0;
}

.modifyDayViewCss_confirm{
	display: inline-block;
	width: 300rpx;
	background-color: #007AFF;
	color: #FFFFFF;
}

.modifyDayViewCss_cancel{
	display: inline-block;
	width: 300rpx;
	background-color: #FF0000;
	color: #FFFFFF;
}

.modifyDayViewCss_dateCss{
	display: inline-block;
	text-align: center;
	margin:40rpx 20rpx 80rpx 20rpx;
}

.modifyDayViewCss_dateCss p{
	
}

.modifyDayViewCss_dateCss picker-view{	
	position: relative;
	z-index: 3;
	width: 300rpx;
	height: 400rpx;
	margin-top: 30rpx;
}

.modifyDayViewCss_dateCss picker-view-column{
	background-color: #C8C7CC
}

</style>
