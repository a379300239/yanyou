<template>
	<view style="height: 100%;">
		
		<!-- 封面 -->
		<view style="width: 750rpx; position: relative;z-index: 1;display: flex;align-items: center;background-color: #F5F5F5;">
			
			<!-- 文字及照片 -->
			<view style="display: inline-block;width: 750rpx;text-align: center;margin: 64rpx 0 52rpx 0;">
				<p style="color: #FFFFFF;font-size: 45rpx;">概览</p>
				<view style="width: 610rpx;height: 250rpx;overflow: hidden;border-radius: 20rpx;display: inline-block;margin-top:25rpx ;box-shadow: 0rpx 5px 5px #888888;">
					<image :src="routeInformaion.routeImg" style="width: 610rpx;"></image>
				</view>
			</view>
			
			<!-- 背景 -->
			<view style="width: 750rpx;position: absolute; z-index: -1;left: 0rpx;top: 0rpx; background-color: #F5F5F5;">
				<!-- 上方花纹 -->
				<image src="../../../static/myInformation/bgImg_up.png" style="position: absolute;z-index:-1;width:750rpx;height: 196rpx;"/>
			</view>
			
		</view>
		
		<!-- 路线编辑 日期显示-->
		<view class="routeEditCss" >
			<!-- 左边 -->
			<scroll-view
				:style="{ 'height':scrollHeight }"
				class="routeEditCss_left"
				scroll-y="true"
				id="routeEdit_left"
				>
				
				<view
					v-for="(day,index) in routeInformaion.route"
					class="routeEditCss_left_day"
					:key="index"
					@click="change_day(index)"
					v-bind:class="{'routeEditCss_left_day_choosed':index==dayId}">
					<p class="routeEditCss_left_date">{{get_nextDate(routeInformaion.routeStartTime,index)}}</p>
					<p class="routeEditCss_left_place">暂无行程</p>
				</view>
			</scroll-view>
			
			<!-- 右边，景点调整 -->
			<scroll-view
				class="routeEditCss_right"
				:style="{ 'height':scrollHeight }"
				scroll-y="true"
				>
				
				<!-- 景点列表 -->
				<view class="routeEditCss_right_list">
					<view
					v-if="routeInformaion.route[dayId].length==0"
					class="routeEditCss_right_list_none"
					:style="{ 'height':scrollHeight }">
						<p>暂无行程，赶快添加一个吧</p>
					</view>
					
					<!-- 单个景点 -->
					<dragSort
						:list="routeInformaion.route[dayId]"
						:isDeleting="isDeleting"
						@change="onDragSite"
						@choose_delete="choose_delete"
						></dragSort>

					
				</view>
			</scroll-view>
			
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
			@trigger="click_menuButton" 
			@fabClick="click_fab" />
			
		<!-- 增加景点类型选择 -->
		<view v-if="isPopUp" class="myPopupCss" @touchmove.stop.prevent="moveHandle">
			<!-- 选择按钮，2*3 -->
			<view class="myPopupCss_siteChoose">
				<view v-for="(item,index) in addSiteData" :key="index" @click="open_addChooseView(index)">
					<image :src="item.url"></image>
					<p>{{item.title}}</p>
				</view>
			</view>
			
			<!-- 关闭按钮 -->
			<view class="myPopupCss_closeButton" @click="close_addView">
				<image src="../../../static/modifySite/closeButton.png"/>
			</view>
		</view>
		
		<!-- 按钮 -->
		<view
			v-if="isDeleting"
			style="display: flex; justify-content: space-around;position: fixed; bottom: 60rpx;left: 202rpx;right: 0rpx;"
			>
			<button class="deleteSiteViewCss_cancel" @click="cancel_delete">取消</button>
			<button class="deleteSiteViewCss_confirm" @click="confirm_delete">确认</button>
		</view>
		
	</view>
</template>

<script>
	import dragSort from '@/components/drag-sort/index.vue'
	export default {
		data() {
			return {
				routeId:"",
				userInformation:"",
				userRoute:"",
				routeInformaion:"",
				dayId:"",
				isOperating:false,
				scrollHeight:"",				//左边滚动条高度
				isChoosedDay:false,				//当日被选中，切换css
				//悬浮菜单内容
				menuContent:[
					{
						text: '增加景点',
						active: false
					},
					{
						text: '删除景点',
						active: false
					}
				],
				isPopMenu:true,				//是否使用悬浮按钮
				isPop:true,					//是否弹出
				isPopUp:false,				//是否打开景点类型选择
				//增加景点的数据
				addSiteData:[
					{
						title:'景点',
						url:'../../../static/modifySite/site_c.png'
					},
					{
						title:'美食',
						url:'../../../static/modifySite/food_c.png'
					},
					{
						title:'住宿',
						url:'../../../static/modifySite/hotel_c.png'
					},
					{
						title:'交通',
						url:'../../../static/modifySite/traffic_c.png'
					},
					{
						title:'自定义',
						url:'../../../static/modifySite/custom_c.png'
					}
				],
				iconUrl:'../../../static/modifySite/',
				iconUrl_houZhui:'.png',
				isDeleting:false,
				deleteArray:[]
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
				
				// 当前编辑日期
				this.change_day(e.dayId);
				
			},
			
			onShow:function(){
				this.userRoute=uni.getStorageSync(this.userInformation.userName+"_route");
				this.routeInformaion=this.userRoute[this.routeId];
			},
			
			//第一次加载时
			onReady:function(){
				//设置当前滚动容器的高
				this.get_scrollHeight();
			},
			
			onBackPress:function(){
				//正在选择景点
				if(this.isPopUp){
					this.close_addView();
					return true;
				}
				//悬浮菜单打开
				if(this.$refs.fab.isShow){
					this.$refs.fab.close();
					return true;
				}
				return false;
			},
			
			//得到输入data的后day天
			get_nextDate:function (date,day) {
				var s=date.split('-');
				var nDate=new Date(parseInt(s[0]),parseInt(s[1])-1,parseInt(s[2]));
				var nextDate=new Date(Date.parse(nDate)+day*24*60*60*1000);
				var year=nextDate.getFullYear();
				var mon=nextDate.getMonth()+1;
				var day=nextDate.getDate();
				return mon+'月'+day+'日';
			},
			
			//当改变当前日期时
			change_day:function(dayId){
				this.dayId=dayId;
			},
			
			//获取当前应有的高度
			get_scrollHeight:function(){
				
				//获得屏幕高度
				uni.getSystemInfo({
					success:(res)=>{
						//获得列表高度
						let dom = uni.createSelectorQuery().in(this);
						dom.select("#routeEdit_left").boundingClientRect(data =>{
							this.scrollHeight=`${res.windowHeight-data.top}px`;
						}).exec();
					}
				});
			},
			
			//点击悬浮按钮
			click_fab:function(){
				
			},
			
			//点击菜单选项
			click_menuButton:function(e){
				switch (e.index){
					case 0:this.add_site();break;
					case 1:this.delete_site();break;
					default:
						break;
				}
			},
			
			over_operate:function(){
				this.isOperating=false;
				this.isPopMenu=true;
			},
			
			start_operate:function(){
				this.isOperating=true;
				this.isPopMenu=false;
			},
			
			// 增加景点
			add_site:function(){
				this.isPopUp=true;
				this.start_operate();
			},
			
			//根据不同类型进入不同页面
			open_addChooseView:function(index){
				switch (index){
					case 0:this.open_choosePage('site');
						break;
					case 1:this.open_choosePage('food');
						break;
					case 2:this.open_choosePage('hotel');
						break;
					case 3:this.open_choosePage('traffic');
						break;
					case 4:this.open_choosePage('custom');
						break;
					default:
						break;
				}
			},
			
			open_choosePage:function(type){
				uni.navigateTo({
					url:"../modify_routeInformation/add_site/add_site?routeId="+this.routeId+"&dayId="+this.dayId+"&siteType="+type
				})
			},
			
			//禁止滚动形式需要
			moveHandle:function(){
			},
			
			//关闭增加面板
			close_addView:function(){
				this.isPopUp=false;
				this.over_operate();
			},
			
			//修改景点
			modify_site:function(startId,endId){
				this.routeInformaion.route[this.dayId].splice(endId+Number(startId<endId),0,this.routeInformaion.route[this.dayId][startId]);	//插入
				this.routeInformaion.route[this.dayId].splice(startId+Number(startId>endId),1)								//删除原来
				this.save();
			},
			
			//当拖拽单个景点时
			onDragSite:function(e){
				//为第一个时
				if(!e.frontData && e.frontData!=0){
					e.frontData=-1;
				}
				this.modify_site(e.data,e.frontData+1)
			},
			
			//开始删除景点
			delete_site:function(){
				this.start_operate();
				this.isDeleting=true;
				
				//删除数组初始化
				this.deleteArray=[];
				for(var i=0;i<this.routeInformaion.route[this.dayId].length;i++){
					this.deleteArray.push(false);
				}
			},
			
			//删除景点中
			choose_delete:function(e){
				this.deleteArray[e]=true;
			},
			
			confirm_delete:function(){
				//开始删除
				var cach=[];
				for(var i=0;i<this.routeInformaion.route[this.dayId].length;i++){
					//如果下标不是要删除的，则用cach数组记录
					if(!this.deleteArray[i]){
						cach.push(this.routeInformaion.route[this.dayId][i]);
					}
				}
				this.routeInformaion.route[this.dayId]=cach;
				this.save();
				
				this.over_operate();
				this.isDeleting=false;
			},
			
			cancel_delete:function(){
				this.over_operate();
				this.isDeleting=false;
			},
			
			//保存当前信息到数据库
			save:function(){
				this.userRoute[this.routeId]=this.routeInformaion;
				uni.setStorageSync(this.userInformation.userName+"_route",this.userRoute);
			}
		},
		computed:{
			
		},
		components:{
			dragSort
		}
	}
</script>

<style>
.routeEditCss{
	width: 750rpx;
	height: 100%;
	display: flex;
	overflow: hidden;
}

.routeEditCss_left{
	width: 202rpx;
	margin-top: 54rpx;
	background-color: #F5F5F5;
}

.routeEditCss_left_day{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 152rpx;
	width: 202rpx;
	border-top: #C8C7CC 1rpx solid;
}

.routeEditCss_left_day_choosed{
	background-color: #FFFFFF;
}

.routeEditCss_left_date{
	color: #666666;
	font-size: 39rpx;
}

.routeEditCss_left_place{
	margin-top: 11rpx;
	color: #333333;
	font: 42rpx;
}

.routeEditCss_right{
	margin-top: 54rpx;
}

.routeEditCss_right_list{
	
}

.routeEditCss_right_list_none{
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	bottom:150rpx
}

.routeEditCss_right_site{
	display: flex;
	align-items: center;
	height: 152rpx;
	overflow: hidden;
}

.routeEditCss_right_site_text{
	border-bottom: 1rpx #C8C7CC solid;
	padding-bottom: 30rpx;
	width: 400rpx;
}

.routeEditCss_right_site image{
	width: 62rpx;
	height: 62rpx;
	margin: 0 44rpx 0 34rpx;
}

.routeEditCss_right_site_number{
	font-size: 39rpx;
	color: #666666;
}

.routeEditCss_right_site_siteName{
	font-size: 45rpx;
	color: #333333;
}

.routeEditCss_right_site_line{
	margin-top: 30rpx;
	width: 412rpx;
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
	background-color: #F5F5F5;
}

.myPopupCss_siteChoose{
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.myPopupCss_siteChoose view{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0 64rpx 44rpx 64rpx;
}

.myPopupCss_siteChoose image{
	width: 194rpx;
	height: 80rpx;
}

.myPopupCss_siteChoose p{
	margin-top: 12rpx;
	color: #333333;
	font-size: 36rpx;
}

.myPopupCss_closeButton{
	width: 750rpx;
	display: flex;
	justify-content: center;
	position: fixed;
	bottom: 40rpx;
}

.myPopupCss_closeButton image{
	height: 76rpx;
	width: 76rpx;
}

.deleteSiteViewCss_confirm{
	display: inline-block;
	width: 200rpx;
	background-color: #007AFF;
	color: #FFFFFF;
}

.deleteSiteViewCss_cancel{
	display: inline-block;
	width: 200rpx;
	background-color: #FF0000;
	color: #FFFFFF;
}
</style>
